package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	oidc "github.com/coreos/go-oidc"
	"github.com/fsnotify/fsnotify"
	"github.com/pkg/errors"
	"golang.org/x/oauth2"
	"k8s.io/client-go/kubernetes"
	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

type Context struct {
	Name     string
	cluster  Cluster
	authInfo *clientcmdapi.AuthInfo
}

func (c *Context) getClientConfig() clientcmd.ClientConfig {
	if c.authInfo == nil {
		c.authInfo = &clientcmdapi.AuthInfo{}
	}

	conf := clientcmdapi.Config{
		Clusters: map[string]*clientcmdapi.Cluster{
			c.cluster.Name: c.cluster.config,
		},
		AuthInfos: map[string]*clientcmdapi.AuthInfo{
			c.cluster.Name: c.authInfo,
		},
		Contexts: map[string]*clientcmdapi.Context{
			c.Name: {
				Cluster:  c.cluster.Name,
				AuthInfo: c.cluster.Name,
			},
		},
	}

	return clientcmd.NewInteractiveClientConfig(conf, c.Name, nil, nil, nil)
}

func (c *Context) restConfig() (*rest.Config, error) {
	return c.getClientConfig().ClientConfig()
}

func (c *Context) getClientSetToInteractWithKubernetesAPIServer(token string) (clientset *kubernetes.Clientset,
	err error,
) {
	restConf, err := c.restConfig()
	if err != nil {
		return nil, err
	}

	if token != "" {
		restConf.BearerToken = token
	}

	return kubernetes.NewForConfig(restConf)
}

type OauthConfig struct {
	Config   *oauth2.Config
	Verifier *oidc.IDTokenVerifier
	Ctx      context.Context
}

type OidcConfig struct {
	ClientID     string
	ClientSecret string
	IdpIssuerURL string
	Scopes       []string
}

var oidcConfigCache = make(map[string]*OidcConfig)

func GetContextsFromKubeConfigFile(kubeConfigPath string) ([]Context, error) {
	config, err := clientcmd.LoadFromFile(kubeConfigPath)
	if err != nil {
		return nil, err
	}

	return GetContextsFromKubeConfig(config)
}

func GetContextsFromKubeConfig(config *clientcmdapi.Config) ([]Context, error) {
	contexts := []Context{}

	for key, value := range config.Contexts {
		clusterConfig := config.Clusters[value.Cluster]
		if clusterConfig == nil {
			log.Printf("Not adding context %v because cluster doesn't exist!\n", key)
			continue
		}

		authInfo := config.AuthInfos[value.AuthInfo]
		authType := ""

		if authInfo == nil && value.AuthInfo != "" {
			log.Printf("Not adding context: %v because user: %v could not be found!\n", key, value.AuthInfo)
			continue
		}

		if authInfo != nil {
			authProvider := authInfo.AuthProvider
			if authProvider != nil {
				authType = "oidc"

				var oidcConfig OidcConfig
				oidcConfig.ClientID = authProvider.Config["client-id"]
				oidcConfig.ClientSecret = authProvider.Config["client-secret"]
				oidcConfig.IdpIssuerURL = authProvider.Config["idp-issuer-url"]
				oidcConfig.Scopes = strings.Split(authProvider.Config["extra-scopes"], ",")

				oidcConfigCache[key] = &oidcConfig
			}
		}

		cluster := Cluster{key, clusterConfig.Server, clusterConfig, authType, nil, clusterConfig.ProxyURL}

		contexts = append(contexts, Context{key, cluster, authInfo})
	}

	return contexts, nil
}

func (c *Context) getCluster() *Cluster {
	return &c.cluster
}

func GetOwnContext(config *HeadlampConfig) (*Context, error) {
	cluster, err := GetOwnCluster(config)
	if err != nil {
		return nil, err
	}

	authInfo := &clientcmdapi.AuthInfo{}

	return &Context{cluster.Name, *cluster, authInfo}, nil
}

// getContextFromKubeConfigs returns the contexts from the kubeconfig files.
func getContextFromKubeConfigs(path string) []Context {
	var contexts []Context

	if path != "" {
		kubeConfigs := splitKubeConfigPath(path)
		for _, kubeConfig := range kubeConfigs {
			kubeConfig, err := absPath(kubeConfig)
			if err != nil {
				log.Printf("Failed to resolve absolute path of :%s, error: %v\n", kubeConfig, err)
				continue
			}

			contextsFound, err := GetContextsFromKubeConfigFile(kubeConfig)
			if err != nil {
				log.Println("Failed to get contexts from", kubeConfig, err)
			}

			contexts = append(contexts, contextsFound...)
		}
	}

	return contexts
}

// refreshHeadlampConfig refreshes the headlamp config.
// it removes all the contexts that are loaded from kube config and adds the new ones.
func refreshHeadlampConfig(config *HeadlampConfig) {
	path := config.kubeConfigPath
	// load configs
	contexts := getContextFromKubeConfigs(path)
	// removing the old contexts from kube config
	for key, contextProxy := range config.contextProxies {
		if contextProxy.source == KubeConfig {
			log.Printf("Removing cluster %q from contextProxies\n", key)
			delete(config.contextProxies, key)
		}
	}
	// adding the new contexts from kube config
	for _, context := range contexts {
		context := context
		log.Printf("Setting up proxy for context %s\n", context.Name)

		proxy, err := config.createProxyForContext(context)
		if err != nil {
			log.Printf("Error setting up proxy for context %s: %s\n", context.Name, err)
			continue
		}

		fmt.Printf("\tlocalhost:%d%s%s/{api...} -> %s\n", config.port, config.baseURL, "/clusters/"+context.Name,
			*context.cluster.getServer())

		config.contextProxies[context.Name] = contextProxy{
			&context,
			proxy,
			KubeConfig,
		}
	}
}

func splitKubeConfigPath(path string) []string {
	delimiter := ":"
	if runtime.GOOS == "windows" {
		delimiter = ";"
	}

	return strings.Split(path, delimiter)
}

// watchForKubeConfigChanges watches for changes in the kubeconfig file and
// refreshes the config when it changes.
func watchForKubeConfigChanges(config *HeadlampConfig) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Println("Error watching for kube config changes:", err)
		return
	}
	defer watcher.Close()

	done := make(chan bool)

	kubeConfigsPaths := splitKubeConfigPath(config.kubeConfigPath)

	for _, path := range kubeConfigsPaths {
		log.Println("setting up watcher for kubeconfig changes", path)

		err = watcher.Add(path)
		if err != nil {
			log.Printf("Couldn't add %s to watcher: %v", path, err)
		}
	}

	go handleWatchEvents(watcher, config)

	<-done
}

func handleWatchEvents(watcher *fsnotify.Watcher, config *HeadlampConfig) {
	const tickerDuration = 10 * time.Second

	ticker := time.NewTicker(tickerDuration)

	kubeConfigsPaths := splitKubeConfigPath(config.kubeConfigPath)

	for {
		select {
		// when the kubeconfig file is removed the watcher stops listening
		// so this is a workaround to periodically check if the file exists
		// and add it to the watcher, the file cannot be added when we get
		// a remove event as the file has to exist to be added to the watcher.
		case tick := <-ticker.C:
			if len(watcher.WatchList()) != len(kubeConfigsPaths) {
				for _, path := range kubeConfigsPaths {
					path := path
					// check if kubeconfig file exists and add it to watcher
					if _, err := os.Stat(path); err == nil {
						log.Println(path, " file recreated at ", tick, " adding it to watcher")

						err := watcher.Add(path)
						if err != nil {
							log.Printf("Couldn't add %s to watcher: %v", path, err)
							continue
						}

						refreshHeadlampConfig(config)
					}
				}
			}
		case event := <-watcher.Events:
			triggers := []fsnotify.Op{fsnotify.Write, fsnotify.Create, fsnotify.Remove, fsnotify.Rename}
			for _, trigger := range triggers {
				if event.Op.Has(trigger) {
					log.Println("kubeconfig changed, reloading configs ", event)
					refreshHeadlampConfig(config)
				}
			}
		case err := <-watcher.Errors:
			log.Println("error:", err)
		}
	}
}

func writeKubeConfig(config clientcmdapi.Config, path string) error {
	configFile := filepath.Join(path, "config")
	now := time.Now().Format("20060102150405")
	// check if config file exists
	if _, err := os.Stat(configFile); err == nil {
		// if it exists, write a new config file with a timestamp
		fileName := "config_" + now + ".yaml"

		newKubeConfigFile := filepath.Join(path, fileName)
		err = clientcmd.WriteToFile(config, newKubeConfigFile)

		if err != nil {
			return errors.Wrap(err, "failed to write new kubeconfig file")
		}

		defer os.Remove(newKubeConfigFile)

		load := clientcmd.ClientConfigLoadingRules{
			Precedence: []string{configFile, newKubeConfigFile},
		}

		mergedConfig, err := load.Load()
		if err != nil {
			return errors.Wrap(err, "failed to load merged kubeconfig")
		}

		config = *mergedConfig
	}

	return clientcmd.WriteToFile(config, configFile)
}

// removeContextFromKubeConfigFile removes the given context and its related
// cluster and user from the kubeconfig file.
func removeContextFromKubeConfigFile(context string, path string) error {
	config, err := clientcmd.LoadFromFile(path)
	if err != nil {
		return errors.Wrap(err, "failed to load kubeconfig file")
	}

	// remove the context from the config
	contextConfig, ok := config.Contexts[context]
	if !ok {
		return errors.New("context not found in kubeconfig")
	}

	clusterToRemove := contextConfig.Cluster

	userToRemove := contextConfig.AuthInfo

	delete(config.Contexts, context)

	// check if cluster is used in other contexts
	clusterUsed := false

	for _, contextConfig := range config.Contexts {
		if contextConfig.Cluster == clusterToRemove {
			clusterUsed = true
			break
		}
	}

	// remove the cluster from the config
	if !clusterUsed {
		delete(config.Clusters, clusterToRemove)
	}

	// check if user is used in other contexts
	userUsed := false

	for _, contextConfig := range config.Contexts {
		if contextConfig.AuthInfo == userToRemove {
			userUsed = true
			break
		}
	}

	// remove the user from the config
	if !userUsed {
		delete(config.AuthInfos, userToRemove)
	}

	return clientcmd.WriteToFile(*config, path)
}

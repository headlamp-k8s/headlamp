package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"runtime"
	"strings"
	"time"

	oidc "github.com/coreos/go-oidc"
	"github.com/fsnotify/fsnotify"
	"golang.org/x/oauth2"
	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/tools/clientcmd"
	clientcmdapi "k8s.io/client-go/tools/clientcmd/api"
)

type Context struct {
	Name     string
	cluster  Cluster
	authInfo *clientcmdapi.AuthInfo
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

		cluster := Cluster{key, clusterConfig.Server, clusterConfig, authType, nil}

		contexts = append(contexts, Context{key, cluster, authInfo})
	}

	return contexts, nil
}

func (c *Context) getCluster() *Cluster {
	return &c.cluster
}

func (c *Context) getClientCertificate() string {
	if c.authInfo != nil {
		return c.authInfo.ClientCertificate
	}

	return ""
}

func (c *Context) getClientKey() string {
	if c.authInfo != nil {
		return c.authInfo.ClientKey
	}

	return ""
}

func (c *Context) getClientCertificateData() []byte {
	if c.authInfo != nil {
		return c.authInfo.ClientCertificateData
	}

	return nil
}

func (c *Context) getClientKeyData() []byte {
	if c.authInfo != nil {
		return c.authInfo.ClientKeyData
	}

	return nil
}

func GetOwnContext(config *HeadlampConfig) (*Context, error) {
	cluster, err := GetOwnCluster(config)
	if err != nil {
		return nil, err
	}

	return &Context{cluster.Name, *cluster, nil}, nil
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

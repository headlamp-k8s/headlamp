package kubeconfig

import (
	"errors"
	"log"
	"net/http"
	"net/url"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/gorilla/mux"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
	"k8s.io/kubectl/pkg/proxy"
)

// TODO: Use a different way to avoid name clashes with other clusters.
const InClusterContextName = "main"

type Context struct {
	Name        string        `json:"name"`
	KubeContext *api.Context  `json:"kubeContext"`
	Cluster     *api.Cluster  `json:"cluster"`
	AuthInfo    *api.AuthInfo `json:"authInfo"`
}

func (c *Context) ClientConfig() clientcmd.ClientConfig {

	// If the context is empty, return nil.
	if c.Name == "" && c.KubeContext == nil && c.Cluster == nil && c.AuthInfo == nil {
		return nil
	}

	if c.KubeContext == nil {
		c.KubeContext = &api.Context{}
	}
	if c.Cluster == nil {
		c.Cluster = &api.Cluster{}
	}
	if c.AuthInfo == nil {
		c.AuthInfo = &api.AuthInfo{}
	}

	conf := api.Config{
		Clusters: map[string]*api.Cluster{
			c.KubeContext.Cluster: c.Cluster,
		},
		AuthInfos: map[string]*api.AuthInfo{
			c.KubeContext.AuthInfo: c.AuthInfo,
		},
		Contexts: map[string]*api.Context{
			c.Name: c.KubeContext,
		},
	}

	return clientcmd.NewNonInteractiveClientConfig(conf, c.Name, nil, nil)
}

func (c *Context) RestConfig() (*rest.Config, error) {
	clientConfig := c.ClientConfig()
	if clientConfig == nil {
		return nil, errors.New("clientConfig is nil")
	}
	return clientConfig.ClientConfig()
}

// func (c *Context) OidcConfig() (*OidcConfig, error) {
// 	oidcConfig := &OidcConfig{}
// }

func (c *Context) ProxyRequest(writer *http.ResponseWriter, request *http.Request) error {

	restConf, err := c.RestConfig()
	if err != nil {
		return err
	}

	proxyURL, err := url.Parse(restConf.Host)
	if err != nil {
		return err
	}

	request.Host = restConf.Host
	request.Header.Set("X-Forwarded-Host", request.Header.Get("Host"))
	request.URL.Host = proxyURL.Host
	request.URL.Path = mux.Vars(request)["api"]
	request.URL.Scheme = proxyURL.Scheme

	handler, err := proxy.NewProxyHandler("/api", nil, restConf, 0, false)
	if err != nil {
		return err
	}

	handler.ServeHTTP(*writer, request)

	return nil
}

func LoadContextsFromKubeConfigFile(kubeConfigPath string) ([]Context, error) {

	// If the file path is relative make it absolute.
	if !filepath.IsAbs(kubeConfigPath) {
		absPath, err := filepath.Abs(kubeConfigPath)
		if err != nil {
			return nil, err
		}
		kubeConfigPath = absPath
	}

	config, err := clientcmd.LoadFromFile(kubeConfigPath)
	if err != nil {
		return nil, err
	}

	return LoadContextsFromKubeConfig(config), nil
}

func LoadContextsFromKubeConfig(config *api.Config) []Context {

	var contexts []Context

	for contextName, context := range config.Contexts {
		cluster := config.Clusters[context.Cluster]
		if cluster == nil {
			continue
		}

		authInfo := config.AuthInfos[context.AuthInfo]
		if authInfo == nil {
			continue
		}

		contexts = append(contexts, Context{
			Name:        contextName,
			KubeContext: context,
			Cluster:     cluster,
			AuthInfo:    authInfo,
		})
	}

	return contexts
}

func LoadContextsFromMultipleKubeConfigs(kubeConfigs string) []Context {
	var contexts []Context

	kubeConfigPaths := splitKubeConfigPath(kubeConfigs)

	for _, kubeConfigPath := range kubeConfigPaths {
		kubeConfigContexts, err := LoadContextsFromKubeConfigFile(kubeConfigPath)
		if err != nil {
			log.Println("Error loading kubeconfig file", kubeConfigPath, err)
		}

		contexts = append(contexts, kubeConfigContexts...)
	}

	return contexts
}

func splitKubeConfigPath(path string) []string {
	delimiter := ":"
	if runtime.GOOS == "windows" {
		delimiter = ";"
	}

	return strings.Split(path, delimiter)
}

func GetInClusterContext() (*Context, error) {

	clusterConfig, err := rest.InClusterConfig()
	if err != nil {
		return nil, err
	}

	cluster := &api.Cluster{
		Server:                   clusterConfig.Host,
		CertificateAuthority:     clusterConfig.CAFile,
		CertificateAuthorityData: clusterConfig.CAData,
	}

	inClusterContext := &api.Context{
		Cluster:  InClusterContextName,
		AuthInfo: InClusterContextName,
	}

	inClusterAuthInfo := &api.AuthInfo{}

	return &Context{
		Name:        InClusterContextName,
		KubeContext: inClusterContext,
		Cluster:     cluster,
		AuthInfo:    inClusterAuthInfo,
	}, nil
}

func LoadAndStoreKubeConfigs(kubeConfigStore ContextStore, kubeConfigs string) error {

	// Note: No need to remove contexts from the store, since
	// adding a context with the same name will overwrite the old one.

	kubeConfigContexts := LoadContextsFromMultipleKubeConfigs(kubeConfigs)

	for _, kubeConfigContext := range kubeConfigContexts {
		kubeConfigContext := kubeConfigContext
		err := kubeConfigStore.AddContext(&kubeConfigContext)
		if err != nil {
			return err
		}
	}

	return nil
}

package kubeconfig

import (
	"errors"
	"log"
	"net/http"
	"path/filepath"
	"runtime"
	"strings"

	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
	"k8s.io/kubectl/pkg/proxy"
)

// TODO: Use a different way to avoid name clashes with other clusters.
const InClusterContextName = "main"

type Context struct {
	Name         string        `json:"name"`
	KubeContext  *api.Context  `json:"kubeContext"`
	Cluster      *api.Cluster  `json:"cluster"`
	AuthInfo     *api.AuthInfo `json:"authInfo"`
	ProxyHandler http.Handler  `json:"-"`
}

type OidcConfig struct {
	ClientID     string
	ClientSecret string
	IdpIssuerURL string
	Scopes       []string
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

func (c *Context) RESTConfig() (*rest.Config, error) {
	clientConfig := c.ClientConfig()
	if clientConfig == nil {
		return nil, errors.New("clientConfig is nil")
	}

	return clientConfig.ClientConfig()
}

func (c *Context) OidcConfig() (*OidcConfig, error) {

	if c.AuthInfo.AuthProvider == nil {
		return nil, errors.New("authProvider is nil")
	}

	return &OidcConfig{
		ClientID:     c.AuthInfo.AuthProvider.Config["client-id"],
		ClientSecret: c.AuthInfo.AuthProvider.Config["client-secret"],
		Scopes:       strings.Split(c.AuthInfo.AuthProvider.Config["scope"], ","),
		IdpIssuerURL: c.AuthInfo.AuthProvider.Config["idp-issuer-url"],
	}, nil
}

func (c *Context) ProxyRequest(writer http.ResponseWriter, request *http.Request) error {

	if c.ProxyHandler == nil {
		err := c.setupProxy()
		if err != nil {
			return err
		}
	}

	c.ProxyHandler.ServeHTTP(writer, request)
	return nil
}

func (c *Context) ClientSetWithToken(token string) (*kubernetes.Clientset, error) {
	restConf, err := c.RESTConfig()
	if err != nil {
		return nil, err
	}

	restConf.BearerToken = token

	return kubernetes.NewForConfig(restConf)
}

func (c *Context) setupProxy() error {
	restConf, err := c.RESTConfig()
	if err != nil {
		return err
	}

	handler, err := proxy.NewProxyHandler("/api", nil, restConf, 0, false)
	if err != nil {
		return err
	}

	c.ProxyHandler = handler

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

	return LoadContextsFromKubeConfig(config)
}

func LoadContextsFromKubeConfig(config *api.Config) ([]Context, error) {
	contexts := []Context{}

	for contextName, context := range config.Contexts {
		cluster := config.Clusters[context.Cluster]
		if cluster == nil {
			return nil, errors.New("cluster not found")
		}

		authInfo := config.AuthInfos[context.AuthInfo]
		if authInfo == nil {
			return nil, errors.New("authInfo not found")
		}

		context := Context{
			Name:        contextName,
			KubeContext: context,
			Cluster:     cluster,
			AuthInfo:    authInfo,
		}

		err := context.setupProxy()
		if err != nil {
			return nil, err
		}

		contexts = append(contexts, context)
	}

	return contexts, nil
}

func LoadContextsFromMultipleKubeConfigs(kubeConfigs string) ([]Context, error) {
	var contexts []Context

	kubeConfigPaths := splitKubeConfigPath(kubeConfigs)

	for _, kubeConfigPath := range kubeConfigPaths {
		kubeConfigContexts, err := LoadContextsFromKubeConfigFile(kubeConfigPath)
		if err != nil {
			log.Println("Error loading kubeconfig file", kubeConfigPath, err)
			return nil, err
		}

		contexts = append(contexts, kubeConfigContexts...)
	}

	return contexts, nil
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

// Note: No need to remove contexts from the store, since
// adding a context with the same name will overwrite the old one.
func LoadAndStoreKubeConfigs(kubeConfigStore ContextStore, kubeConfigs string) error {
	kubeConfigContexts, err := LoadContextsFromMultipleKubeConfigs(kubeConfigs)
	if err != nil {
		return err
	}

	for _, kubeConfigContext := range kubeConfigContexts {
		kubeConfigContext := kubeConfigContext

		err := kubeConfigStore.AddContext(&kubeConfigContext)
		if err != nil {
			return err
		}
	}

	return nil
}

package kubeconfig

import (
	"errors"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"path/filepath"
	"runtime"
	"strings"

	zlog "github.com/rs/zerolog/log"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
)

// TODO: Use a different way to avoid name clashes with other clusters.
const InClusterContextName = "main"

const (
	KubeConfig = 1 << iota
	DynamicCluster
	InCluster
)

type Context struct {
	Name        string                 `json:"name"`
	KubeContext *api.Context           `json:"kubeContext"`
	Cluster     *api.Cluster           `json:"cluster"`
	AuthInfo    *api.AuthInfo          `json:"authInfo"`
	Source      int                    `json:"source"`
	proxy       *httputil.ReverseProxy `json:"-"`
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
	if c.proxy == nil {
		err := c.SetupProxy()
		if err != nil {
			return err
		}
	}

	c.proxy.ServeHTTP(writer, request)
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

func (c *Context) SourceStr() string {
	switch c.Source {
	case KubeConfig:
		return "kubeconfig"
	case DynamicCluster:
		return "dynamic_cluster"
	case InCluster:
		return "incluster"
	default:
		return "unknown"
	}
}

func (c *Context) SetupProxy() error {
	zlog.Info().Msgf("Setting up proxy for context %q to cluster url %q", c.Name, c.Cluster.Server)

	restConf, err := c.RESTConfig()
	if err != nil {
		return err
	}

	roundTripper, err := rest.TransportFor(restConf)
	if err != nil {
		return err
	}

	URL, err := url.Parse(c.Cluster.Server)
	if err != nil {
		return err
	}

	proxy := httputil.NewSingleHostReverseProxy(URL)

	proxy.Transport = roundTripper

	c.proxy = proxy
	return nil
}

func LoadContextsFromKubeConfigFile(kubeConfigPath string, source int) ([]Context, error) {

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

	contexts, err := LoadContextsFromKubeConfig(config)
	if err != nil {
		return nil, err
	}
	var contextsWithSource []Context
	for _, context := range contexts {
		context := context
		context.Source = source
		contextsWithSource = append(contextsWithSource, context)
	}
	return contextsWithSource, nil
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

		err := context.SetupProxy()
		if err != nil {
			return nil, err
		}

		contexts = append(contexts, context)
	}

	return contexts, nil
}

func LoadContextsFromMultipleKubeConfigs(kubeConfigs string, source int) ([]Context, error) {
	var contexts []Context

	kubeConfigPaths := splitKubeConfigPath(kubeConfigs)
	for _, kubeConfigPath := range kubeConfigPaths {
		kubeConfigPath := kubeConfigPath
		kubeConfigContexts, err := LoadContextsFromKubeConfigFile(kubeConfigPath, source)
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
func LoadAndStoreKubeConfigs(kubeConfigStore ContextStore, kubeConfigs string, source int) error {
	kubeConfigContexts, err := LoadContextsFromMultipleKubeConfigs(kubeConfigs, source)
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

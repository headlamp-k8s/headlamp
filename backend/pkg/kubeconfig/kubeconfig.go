package kubeconfig

import (
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"path/filepath"
	"runtime"
	"strings"

	"github.com/headlamp-k8s/headlamp/backend/pkg/logger"
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

// Context contains all information related to a kubernetes context.
type Context struct {
	Name        string                 `json:"name"`
	KubeContext *api.Context           `json:"kubeContext"`
	Cluster     *api.Cluster           `json:"cluster"`
	AuthInfo    *api.AuthInfo          `json:"authInfo"`
	Source      int                    `json:"source"`
	OidcConf    *OidcConfig            `json:"oidcConfig"`
	proxy       *httputil.ReverseProxy `json:"-"`
	Internal    bool                   `json:"internal"`
}

type OidcConfig struct {
	ClientID     string
	ClientSecret string
	IdpIssuerURL string
	Scopes       []string
}

// ClientConfig returns a clientcmd.ClientConfig for the context.
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

// RESTConfig returns a rest.Config for the context.
func (c *Context) RESTConfig() (*rest.Config, error) {
	clientConfig := c.ClientConfig()
	if clientConfig == nil {
		return nil, errors.New("clientConfig is nil")
	}

	return clientConfig.ClientConfig()
}

// OidcConfig returns the oidc config for the context.
func (c *Context) OidcConfig() (*OidcConfig, error) {
	if c.OidcConf != nil {
		return c.OidcConf, nil
	}

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

// ProxyRequest proxies the given request to the cluster.
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

// ClientSetWithToken returns a kubernetes clientset for the context.
func (c *Context) ClientSetWithToken(token string) (*kubernetes.Clientset, error) {
	restConf, err := c.RESTConfig()
	if err != nil {
		return nil, err
	}

	if token != "" {
		restConf.BearerToken = token
	}

	return kubernetes.NewForConfig(restConf)
}

// SourceStr returns the source from which the context was loaded.
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

// SetupProxy sets up a reverse proxy for the context.
func (c *Context) SetupProxy() error {
	URL, err := url.Parse(c.Cluster.Server)
	if err != nil {
		return err
	}

	proxy := httputil.NewSingleHostReverseProxy(URL)

	restConf, err := c.RESTConfig()
	if err == nil {
		roundTripper, err := rest.TransportFor(restConf)
		if err == nil {
			proxy.Transport = roundTripper
		}
	}

	c.proxy = proxy

	logger.Log(logger.LevelInfo, map[string]string{"context": c.Name, "clusterURL": c.Cluster.Server},
		nil, "Proxy setup")

	return nil
}

// AuthType returns the authentication type for the context.
func (c *Context) AuthType() string {
	if (c.OidcConf != nil) || (c.AuthInfo != nil && c.AuthInfo.AuthProvider != nil) {
		return "oidc"
	}

	return ""
}

// LoadContextsFromFile loads contexts from the given kubeconfig file.
func LoadContextsFromFile(kubeConfigPath string, source int) ([]Context, error) {
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

	contexts, errs := LoadContextsFromAPIConfig(config, false)
	if errs == nil {
		return nil, errors.Join(errs...)
	}

	contextsWithSource := make([]Context, 0, len(contexts))

	for _, context := range contexts {
		context := context
		context.Source = source
		contextsWithSource = append(contextsWithSource, context)
	}

	return contextsWithSource, nil
}

// LoadContextsFromAPIConfig loads contexts from the given api.Config.
func LoadContextsFromAPIConfig(config *api.Config, skipProxySetup bool) ([]Context, []error) {
	contexts := []Context{}
	errors := []error{}

	for contextName, context := range config.Contexts {
		cluster := config.Clusters[context.Cluster]
		if cluster == nil {
			errors = append(errors, fmt.Errorf("cluster not found for context: %q", contextName))
			continue
		}

		// Note: nil authInfo is valid as authInfo can be provided by token.
		authInfo := config.AuthInfos[context.AuthInfo]

		context := Context{
			Name:        contextName,
			KubeContext: context,
			Cluster:     cluster,
			AuthInfo:    authInfo,
		}

		if !skipProxySetup {
			err := context.SetupProxy()
			if err != nil {
				errors = append(errors, fmt.Errorf("couldnt setup proxy for context: %q, err:%q", contextName, err))
				continue
			}
		}

		contexts = append(contexts, context)
	}

	return contexts, errors
}

// LoadContextsFromMultipleFiles loads contexts from the given kubeconfig files.
func LoadContextsFromMultipleFiles(kubeConfigs string, source int) ([]Context, error) {
	var contexts []Context

	var errs []error

	kubeConfigPaths := splitKubeConfigPath(kubeConfigs)
	for _, kubeConfigPath := range kubeConfigPaths {
		kubeConfigPath := kubeConfigPath

		kubeConfigContexts, err := LoadContextsFromFile(kubeConfigPath, source)
		if err != nil {
			errs = append(errs, err)
		}

		contexts = append(contexts, kubeConfigContexts...)
	}

	return contexts, errors.Join(errs...)
}

// LoadContextsFromBase64String loads contexts from the given kubeconfig string.
func LoadContextsFromBase64String(kubeConfig string, source int) ([]Context, error) {
	var contexts []Context

	var errs []error

	kubeConfigByte, err := base64.StdEncoding.DecodeString(kubeConfig)
	if err != nil {
		return nil, err
	}

	config, err := clientcmd.Load(kubeConfigByte)
	if err != nil {
		return nil, err
	}

	contexts, errs = LoadContextsFromAPIConfig(config, true)
	if errs == nil {
		return nil, errors.Join(errs...)
	}

	contextsWithSource := make([]Context, 0, len(contexts))

	for _, context := range contexts {
		context := context
		context.Source = source
		contextsWithSource = append(contextsWithSource, context)
	}

	return contextsWithSource, nil
}

func splitKubeConfigPath(path string) []string {
	delimiter := ":"
	if runtime.GOOS == "windows" {
		delimiter = ";"
	}

	return strings.Split(path, delimiter)
}

// GetInClusterContext returns the in-cluster context.
func GetInClusterContext(oidcIssuerURL string,
	oidcClientID string, oidcClientSecret string,
	oidcScopes string,
) (*Context, error) {
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

	var oidcConf *OidcConfig

	if oidcClientID != "" && oidcClientSecret != "" && oidcIssuerURL != "" && oidcScopes != "" {
		oidcConf = &OidcConfig{
			ClientID:     oidcClientID,
			ClientSecret: oidcClientSecret,
			IdpIssuerURL: oidcIssuerURL,
			Scopes:       strings.Split(oidcScopes, ","),
		}
	}

	return &Context{
		Name:        InClusterContextName,
		KubeContext: inClusterContext,
		Cluster:     cluster,
		AuthInfo:    inClusterAuthInfo,
		OidcConf:    oidcConf,
	}, nil
}

// LoadAndStoreKubeConfigs loads contexts from the given kubeconfig files and
// stores them in the given context store.
// Note: No need to remove contexts from the store, since
// adding a context with the same name will overwrite the old one.
func LoadAndStoreKubeConfigs(kubeConfigStore ContextStore, kubeConfigs string, source int) error {
	kubeConfigContexts, err := LoadContextsFromMultipleFiles(kubeConfigs, source)
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

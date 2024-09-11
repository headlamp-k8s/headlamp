package kubeconfig

import (
	"encoding/base64"
	"errors"
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"runtime"
	"strings"

	"gopkg.in/yaml.v2"
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	k8sruntime "k8s.io/apimachinery/pkg/runtime"

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

// CustomObject represents the custom object that holds the HeadlampInfo regarding custom name.
type CustomObject struct {
	metav1.TypeMeta
	metav1.ObjectMeta
	CustomName string `json:"customName"`
}

// DeepCopyObject returns a copy of the CustomObject.
func (o *CustomObject) DeepCopyObject() k8sruntime.Object {
	return o.DeepCopy()
}

// DeepCopy creates a deep copy of the CustomObject.
func (o *CustomObject) DeepCopy() *CustomObject {
	if o == nil {
		return nil
	}

	copied := &CustomObject{}
	o.ObjectMeta.DeepCopyInto(&copied.ObjectMeta)
	copied.TypeMeta = o.TypeMeta
	copied.CustomName = o.CustomName

	return copied
}

// ContextError is an error that occurs in a context.
type ContextError struct {
	ContextName string
	Reason      string
}

// Error returns a string representation of the error.
func (e ContextError) Error() string {
	return fmt.Sprintf("Error in context '%s': %s", e.ContextName, e.Reason)
}

// ClusterError is an error that occurs in a cluster.
type ClusterError struct {
	ClusterName string
	Reason      string
}

// Error returns a string representation of the error.
func (e ClusterError) Error() string {
	return fmt.Sprintf("Error in cluster '%s': %s", e.ClusterName, e.Reason)
}

// UserError is an error that occurs in a user.
type UserError struct {
	UserName string
	Reason   string
}

// Error returns a string representation of the error.
func (e UserError) Error() string {
	return fmt.Sprintf("Error in user '%s': %s", e.UserName, e.Reason)
}

// DataError is an error that occurs in data.
type DataError struct {
	Field  string
	Reason string
}

// Error returns a string representation of the error.
func (e DataError) Error() string {
	return fmt.Sprintf("Error in field '%s': %s", e.Field, e.Reason)
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

// LoadContextsFromFile loads contexts from a kubeconfig file.
// It reads the kubeconfig file from the given path and loads the contexts from the file.
// It returns an error if the file cannot be read.
// It will return valid contexts and errors if there are any errors in the file.
func LoadContextsFromFile(kubeConfigPath string, source int) ([]Context, []error) {
	data, err := os.ReadFile(kubeConfigPath)
	if err != nil {
		return nil, []error{fmt.Errorf("error reading kubeconfig file: %v", err)}
	}

	return loadContextsFromData(data, source)
}

// LoadContextsFromBase64String loads contexts from a base64 encoded kubeconfig string.
// It decodes the base64 encoded kubeconfig string and loads the contexts from the decoded string.
// It returns an error if the base64 decoding fails.
// It will return valid contexts and errors if there are any errors in the file.
func LoadContextsFromBase64String(kubeConfig string, source int) ([]Context, []error) {
	kubeConfigByte, err := base64.StdEncoding.DecodeString(kubeConfig)
	if err != nil {
		return nil, []error{fmt.Errorf("error decoding base64 kubeconfig: %v", err)}
	}

	return loadContextsFromData(kubeConfigByte, source)
}

// loadContextsFromData is a helper function that loads contexts from a byte slice.
// It parses the byte slice as a YAML file and validates the parsed data.
// It then creates contexts from the parsed data and returns them.
// It returns any errors that occurred during parsing or validation.
func loadContextsFromData(data []byte, source int) ([]Context, []error) {
	var contexts []Context //nolint:prealloc

	var errs []error

	// Parse and validate the config.
	rawConfig, _, err := parseAndValidateConfig(data)
	if err != nil {
		// Log the error but continue processing
		errs = append(errs, fmt.Errorf("error parsing config: %v", err))
	}

	// Extract contexts, clusters, and users from the raw config.
	rawContexts, _ := rawConfig["contexts"].([]interface{})
	rawClusters, _ := rawConfig["clusters"].([]interface{})
	rawUsers, _ := rawConfig["users"].([]interface{})

	// Create contexts from the parsed data.
	for _, rawContext := range rawContexts {
		context, err := createContext(rawContext, rawClusters, rawUsers, source)
		if err != nil {
			errs = append(errs, err)
			continue
		}

		contexts = append(contexts, context)
	}

	// Return the contexts and any errors that occurred.
	return contexts, errs
}

// parseAndValidateConfig parses and validates a kubeconfig file.
// It returns the raw config, the parsed config, and any errors that occurred.
// It returns an error if the file cannot be parsed.
// It returns a valid config if the file is parsed and validated.
// It returns any errors that occurred during parsing or validation.
func parseAndValidateConfig(data []byte) (map[string]interface{}, *api.Config, error) {
	var rawConfig map[string]interface{}

	err := yaml.Unmarshal(data, &rawConfig)
	if err != nil {
		return nil, nil, err
	}

	config, err := clientcmd.Load(data)
	if err != nil {
		return rawConfig, nil, err
	}

	if err := clientcmd.Validate(*config); err != nil {
		return rawConfig, config, err
	}

	return rawConfig, config, nil
}

// createContext creates a context from the given raw context, clusters, and users.
// It returns the created context and any errors that occurred.
// It returns an error if the context cannot be created.
// It returns a valid context if the context is created.
// It returns any errors that occurred during context creation.
func createContext(rawContext interface{}, rawClusters, rawUsers []interface{}, source int) (Context, error) {
	contextMap, ok := rawContext.(map[interface{}]interface{})
	if !ok {
		return Context{}, ContextError{ContextName: "unknown", Reason: "invalid context format"}
	}

	name, _ := contextMap["name"].(string)
	contextData, _ := contextMap["context"].(map[interface{}]interface{})
	clusterName, _ := contextData["cluster"].(string)
	userName, _ := contextData["user"].(string)

	cluster, err := findCluster(rawClusters, clusterName)
	if err != nil {
		return Context{}, ContextError{ContextName: name, Reason: err.Error()}
	}

	authInfo, err := findAuthInfo(rawUsers, userName)
	if err != nil {
		return Context{}, ContextError{ContextName: name, Reason: err.Error()}
	}

	friendlyName := makeDNSFriendly(name)
	kubeContext := createKubeContext(contextData)

	newContext := Context{
		Name:        friendlyName,
		KubeContext: kubeContext,
		Cluster:     cluster,
		AuthInfo:    authInfo,
		Source:      source,
	}

	err = newContext.SetupProxy()
	if err != nil {
		return Context{}, ContextError{ContextName: name, Reason: fmt.Sprintf("couldn't setup proxy: %v", err)}
	}

	return newContext, nil
}

// findCluster finds a cluster in the given raw clusters.
// It returns the found cluster and any errors that occurred.
// It returns an error if the cluster cannot be found.
// It returns a valid cluster if the cluster is found.
// It returns any errors that occurred during cluster search.
func findCluster(rawClusters []interface{}, clusterName string) (*api.Cluster, error) {
	for _, rawCluster := range rawClusters {
		clusterMap, ok := rawCluster.(map[interface{}]interface{})
		if !ok || clusterMap["name"] != clusterName {
			continue
		}

		cluster := &api.Cluster{}
		clusterData, _ := clusterMap["cluster"].(map[interface{}]interface{})

		for key, value := range clusterData {
			strKey, ok := key.(string)
			if !ok {
				return nil, ClusterError{ClusterName: clusterName, Reason: fmt.Sprintf("invalid key type for field '%v'", key)}
			}

			switch strKey {
			case "certificate-authority-data":
				if data, ok := value.(string); ok {
					decoded, err := base64.StdEncoding.DecodeString(data)
					if err != nil {
						return nil, DataError{Field: "certificate-authority-data", Reason: "invalid base64 encoding"}
					}

					cluster.CertificateAuthorityData = decoded
				} else {
					return nil, DataError{Field: "certificate-authority-data", Reason: "expected string, got different type"}
				}
			case "extensions":
				cluster.Extensions = createExtensions(value)
			default:
				err := SetClusterField(cluster, strKey, value)
				if err != nil {
					return nil, ClusterError{ClusterName: clusterName, Reason: err.Error()}
				}
			}
		}

		return cluster, nil
	}

	return nil, ClusterError{ClusterName: clusterName, Reason: "cluster not found"}
}

// findAuthInfo finds an auth info in the given raw users.
// It returns the found auth info and any errors that occurred.
// It returns an error if the auth info cannot be found.
// It returns a valid auth info if the auth info is found.
// It returns any errors that occurred during auth info search.
func findAuthInfo(rawUsers []interface{}, userName string) (*api.AuthInfo, error) {
	for _, rawUser := range rawUsers {
		userMap, ok := rawUser.(map[interface{}]interface{})
		if !ok || userMap["name"] != userName {
			continue
		}

		authInfo := &api.AuthInfo{}
		userData, _ := userMap["user"].(map[interface{}]interface{})

		for key, value := range userData {
			strKey, ok := key.(string)
			if !ok {
				return nil, UserError{UserName: userName, Reason: fmt.Sprintf("invalid key type for field '%v'", key)}
			}

			err := SetAuthInfoField(authInfo, strKey, value)
			if err != nil {
				return nil, UserError{UserName: userName, Reason: err.Error()}
			}
		}

		return authInfo, nil
	}

	return nil, UserError{UserName: userName, Reason: "user not found"}
}

// createAuthProvider creates an auth provider from the given value.
// It returns the created auth provider and any errors that occurred.
// It returns an error if the auth provider cannot be created.
// It returns a valid auth provider if the auth provider is created.
// It returns any errors that occurred during auth provider creation.
func createAuthProvider(value interface{}) *api.AuthProviderConfig {
	provider, ok := value.(map[interface{}]interface{})
	if !ok {
		return nil
	}

	authProvider := &api.AuthProviderConfig{}
	authProvider.Name, _ = provider["name"].(string)

	if config, ok := provider["config"].(map[interface{}]interface{}); ok {
		authProvider.Config = make(map[string]string)

		for k, v := range config {
			if key, ok := k.(string); ok {
				if val, ok := v.(string); ok {
					authProvider.Config[key] = val
				}
			}
		}
	}

	return authProvider
}

// createExecConfig creates an exec config from the given value.
// It returns the created exec config and any errors that occurred.
// It returns a valid exec config if the exec config is created.
// It returns nil if the exec config cannot be created.
func createExecConfig(value interface{}) *api.ExecConfig {
	execData, ok := value.(map[interface{}]interface{})
	if !ok {
		return nil
	}

	execConfig := &api.ExecConfig{}
	execConfig.Command, _ = execData["command"].(string)

	if args, ok := execData["args"].([]interface{}); ok {
		execConfig.Args = make([]string, len(args))
		for i, arg := range args {
			execConfig.Args[i], _ = arg.(string)
		}
	}

	if env, ok := execData["env"].([]interface{}); ok {
		execConfig.Env = make([]api.ExecEnvVar, len(env))

		for i, e := range env {
			if envMap, ok := e.(map[interface{}]interface{}); ok {
				execConfig.Env[i].Name, _ = envMap["name"].(string)
				execConfig.Env[i].Value, _ = envMap["value"].(string)
			}
		}
	}

	return execConfig
}

// createExtensions creates extensions from the given value.
func createExtensions(value interface{}) map[string]k8sruntime.Object {
	extensions, ok := value.(map[interface{}]interface{})
	if !ok {
		return nil
	}

	result := make(map[string]k8sruntime.Object)

	for k, v := range extensions {
		if key, ok := k.(string); ok {
			if obj, ok := v.(k8sruntime.Object); ok {
				result[key] = obj
			} else {
				result[key] = &CustomObject{
					TypeMeta: metav1.TypeMeta{
						Kind:       "CustomObject",
						APIVersion: "v1",
					},
					ObjectMeta: metav1.ObjectMeta{
						Name: key,
					},
					CustomName: key,
				}
			}
		}
	}

	return result
}

// createKubeContext creates a kube context from the given context data.
func createKubeContext(contextData map[interface{}]interface{}) *api.Context {
	kubeContext := &api.Context{}

	if cluster, ok := contextData["cluster"].(string); ok {
		kubeContext.Cluster = cluster
	}

	if namespace, ok := contextData["namespace"].(string); ok {
		kubeContext.Namespace = namespace
	}

	if user, ok := contextData["user"].(string); ok {
		kubeContext.AuthInfo = user
	}

	// Handle extensions if present
	if extensions, ok := contextData["extensions"].(map[interface{}]interface{}); ok {
		kubeContext.Extensions = make(map[string]k8sruntime.Object)

		for k, v := range extensions {
			if key, ok := k.(string); ok {
				if obj, ok := v.(k8sruntime.Object); ok {
					kubeContext.Extensions[key] = obj
				} else {
					// If the extension is not already a runtime.Object,
					// wrap it in a CustomObject
					kubeContext.Extensions[key] = &CustomObject{
						TypeMeta: metav1.TypeMeta{
							Kind:       "CustomObject",
							APIVersion: "v1",
						},
						ObjectMeta: metav1.ObjectMeta{
							Name: key,
						},
						CustomName: key,
					}
				}
			}
		}
	}

	return kubeContext
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

		// Make contextName DNS friendly.
		contextName = makeDNSFriendly(contextName)

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
			errs = append(errs, err...)
		}

		contexts = append(contexts, kubeConfigContexts...)
	}

	return contexts, errors.Join(errs...)
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

// makeDNSFriendly converts a string to a DNS-friendly format.
func makeDNSFriendly(name string) string {
	name = strings.ReplaceAll(name, "/", "--")
	name = strings.ReplaceAll(name, " ", "__")

	return name
}

// SetClusterField sets a cluster field in the given cluster.
// It returns an error if the field cannot be set.
func SetClusterField(cluster *api.Cluster, fieldName string, value interface{}) error {
	switch fieldName {
	case "server", "certificate-authority", "proxy-url", "tls-server-name":
		return setClusterStringField(cluster, fieldName, value)
	case "insecure-skip-tls-verify", "disable-compression":
		return setClusterBoolField(cluster, fieldName, value)
	case "certificate-authority-data":
		return setClusterBase64Data(cluster, fieldName, value)
	case "extensions":
		return setClusterExtensions(cluster, value)
	default:
		return DataError{Field: fieldName, Reason: "unknown field for cluster"}
	}
}

// setClusterStringField sets a string field in the given cluster.
func setClusterStringField(cluster *api.Cluster, fieldName string, value interface{}) error {
	strValue, ok := value.(string)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected string, got different type"}
	}

	switch fieldName {
	case "server":
		cluster.Server = strValue
	case "certificate-authority":
		cluster.CertificateAuthority = strValue
	case "proxy-url":
		cluster.ProxyURL = strValue
	case "tls-server-name":
		cluster.TLSServerName = strValue
	default:
		return DataError{Field: fieldName, Reason: "unknown string field for cluster"}
	}

	return nil
}

// setClusterBoolField sets a boolean field in the given cluster.
func setClusterBoolField(cluster *api.Cluster, fieldName string, value interface{}) error {
	boolValue, ok := value.(bool)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected bool, got different type"}
	}

	switch fieldName {
	case "insecure-skip-tls-verify":
		cluster.InsecureSkipTLSVerify = boolValue
	case "disable-compression":
		cluster.DisableCompression = boolValue
	default:
		return DataError{Field: fieldName, Reason: "unknown string field for cluster"}
	}

	return nil
}

// setClusterBase64Data sets a base64 encoded data field in the given cluster.
func setClusterBase64Data(cluster *api.Cluster, fieldName string, value interface{}) error {
	data, ok := value.(string)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected string, got different type"}
	}

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return DataError{Field: fieldName, Reason: "invalid base64 encoding"}
	}

	cluster.CertificateAuthorityData = decoded

	return nil
}

// setClusterExtensions sets the extensions field in the given cluster.
func setClusterExtensions(cluster *api.Cluster, value interface{}) error {
	extensions := createExtensions(value)
	if extensions == nil {
		return DataError{Field: "extensions", Reason: "invalid extensions data"}
	}

	cluster.Extensions = extensions

	return nil
}

// SetAuthInfoField sets an auth info field in the given auth info.
// It returns an error if the field cannot be set.
func SetAuthInfoField(authInfo *api.AuthInfo, fieldName string, value interface{}) error {
	switch fieldName {
	case "client-certificate-data", "client-key-data":
		return setBase64Data(authInfo, fieldName, value)
	case "client-certificate", "client-key", "token", "tokenFile", "impersonate", "username", "password":
		return setStringField(authInfo, fieldName, value)
	case "impersonate-groups":
		return setStringSliceField(authInfo, fieldName, value)
	case "impersonate-user-extra":
		return setMapStringStringSliceField(authInfo, fieldName, value)
	case "exec":
		return setExecField(authInfo, value)
	case "auth-provider":
		return setAuthProviderField(authInfo, value)
	default:
		return DataError{Field: fieldName, Reason: "unknown field for auth info"}
	}
}

// setBase64Data sets a base64 data field in the given auth info.
func setBase64Data(authInfo *api.AuthInfo, fieldName string, value interface{}) error {
	data, ok := value.(string)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected string, got different type"}
	}

	decoded, err := base64.StdEncoding.DecodeString(data)
	if err != nil {
		return DataError{Field: fieldName, Reason: "invalid base64 encoding"}
	}

	switch fieldName {
	case "client-certificate-data":
		authInfo.ClientCertificateData = decoded
	case "client-key-data":
		authInfo.ClientKeyData = decoded
	default:
		return DataError{Field: fieldName, Reason: "unknown base64 field for auth info"}
	}

	return nil
}

// setStringField sets a string field in the given auth info.
func setStringField(authInfo *api.AuthInfo, fieldName string, value interface{}) error {
	strValue, ok := value.(string)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected string, got different type"}
	}

	switch fieldName {
	case "client-certificate":
		authInfo.ClientCertificate = strValue
	case "client-key":
		authInfo.ClientKey = strValue
	case "token":
		authInfo.Token = strValue
	case "tokenFile":
		authInfo.TokenFile = strValue
	case "impersonate":
		authInfo.Impersonate = strValue
	case "username":
		authInfo.Username = strValue
	case "password":
		authInfo.Password = strValue
	default:
		return DataError{Field: fieldName, Reason: "unknown string field for auth info"}
	}

	return nil
}

// setStringSliceField sets an impersonate groups field in the given auth info.
func setStringSliceField(authInfo *api.AuthInfo, fieldName string, value interface{}) error {
	sliceValue, ok := value.([]string)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected []string, got different type"}
	}

	authInfo.ImpersonateGroups = sliceValue

	return nil
}

// setMapStringStringSliceField sets an impersonate user extra field in the given auth info.
func setMapStringStringSliceField(authInfo *api.AuthInfo, fieldName string, value interface{}) error {
	mapValue, ok := value.(map[string][]string)
	if !ok {
		return DataError{Field: fieldName, Reason: "expected map[string][]string, got different type"}
	}

	authInfo.ImpersonateUserExtra = mapValue

	return nil
}

// setExecField sets an exec field in the given auth info.
func setExecField(authInfo *api.AuthInfo, value interface{}) error {
	execConfig, ok := value.(map[interface{}]interface{})
	if !ok {
		return DataError{Field: "exec", Reason: "invalid exec configuration"}
	}

	authInfo.Exec = createExecConfig(execConfig)

	return nil
}

// setAuthProviderField sets an auth provider field in the given auth info.
func setAuthProviderField(authInfo *api.AuthInfo, value interface{}) error {
	providerConfig, ok := value.(map[interface{}]interface{})
	if !ok {
		return DataError{Field: "auth-provider", Reason: "invalid auth provider configuration"}
	}

	authInfo.AuthProvider = createAuthProvider(providerConfig)

	return nil
}

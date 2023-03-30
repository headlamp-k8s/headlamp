package helm

import (
	"log"

	"helm.sh/helm/v3/pkg/action"
	"helm.sh/helm/v3/pkg/cli"
	"k8s.io/apimachinery/pkg/api/meta"
	"k8s.io/cli-runtime/pkg/genericclioptions"
	"k8s.io/client-go/discovery"
	"k8s.io/client-go/discovery/cached/memory"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/restmapper"
	"k8s.io/client-go/tools/clientcmd"
)

var _ genericclioptions.RESTClientGetter = &restConfigGetter{}
var settings = cli.New()

type HelmHandler struct {
	*action.Configuration
}

func NewActionConfig(clientConfig clientcmd.ClientConfig, namespace string) (*action.Configuration, error) {
	actionConfig := new(action.Configuration)
	restConfGetter := &restConfigGetter{
		clientConfig: clientConfig,
		namespace:    namespace,
	}
	logger := func(format string, a ...interface{}) {
		log.Printf(format+"\n", a...)
	}
	err := actionConfig.Init(restConfGetter, namespace, "secret", logger)
	if err != nil {
		return nil, err
	}
	return actionConfig, nil
}

// https://github.com/helm/helm/issues/6910#issuecomment-601277026
type restConfigGetter struct {
	clientConfig clientcmd.ClientConfig
	namespace    string
}

func (r *restConfigGetter) ToRESTConfig() (*rest.Config, error) {
	return r.clientConfig.ClientConfig()
}

func (r *restConfigGetter) ToRawKubeConfigLoader() clientcmd.ClientConfig {
	return r.clientConfig
}

func (r *restConfigGetter) ToDiscoveryClient() (discovery.CachedDiscoveryInterface, error) {
	config, err := r.ToRESTConfig()
	if err != nil {
		return nil, err
	}

	// The more groups you have, the more discovery requests you need to make.
	// given 25 groups (our groups + a few custom conf) with one-ish version each, discovery needs to make 50 requests
	// double it just so we don't end up here again for a while.  This config is only used for discovery.
	config.Burst = 100

	discoveryClient, _ := discovery.NewDiscoveryClientForConfig(config)
	return memory.NewMemCacheClient(discoveryClient), nil
}

func (r *restConfigGetter) ToRESTMapper() (meta.RESTMapper, error) {
	discoveryClient, err := r.ToDiscoveryClient()
	if err != nil {
		return nil, err
	}

	mapper := restmapper.NewDeferredDiscoveryRESTMapper(discoveryClient)
	expander := restmapper.NewShortcutExpander(mapper, discoveryClient)
	return expander, nil
}

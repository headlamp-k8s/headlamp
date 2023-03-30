package helm

import (
	"fmt"
	"sync"
	"time"

	"github.com/rs/zerolog/log"

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

// key of the object is action_name + "_" + release_name
// action_name is the name of the action, e.g. install, upgrade, delete
// status is one of the following: in_progress, success, failed
type actionStatus struct {
	store map[string]struct {
		status    string
		updatedAt time.Time
		err       error
	}
	sync.Mutex
}

var actionState *actionStatus

func (a *actionStatus) GetStatus(actionName, releaseName string) (string, error) {
	a.Lock()
	defer a.Unlock()
	key := actionName + "_" + releaseName
	if _, ok := a.store[key]; !ok {
		return "", nil
	}
	return a.store[key].status, a.store[key].err
}

func (a *actionStatus) SetStatus(actionName, releaseName, status string, err error) {
	a.Lock()
	defer a.Unlock()
	key := actionName + "_" + releaseName
	a.store[key] = struct {
		status    string
		updatedAt time.Time
		err       error
	}{
		status:    status,
		updatedAt: time.Now(),
		err:       err,
	}
}

func (a *actionStatus) RemoveStaleStatus() {
	a.Lock()
	defer a.Unlock()
	for key, value := range a.store {
		if time.Since(value.updatedAt) > 5*time.Minute {
			delete(a.store, key)
		}
	}
}

func init() {
	actionState = &actionStatus{}
	actionState.store = make(map[string]struct {
		status    string
		updatedAt time.Time
		err       error
	})
	go func() {
		for {
			actionState.RemoveStaleStatus()
			time.Sleep(time.Minute)
		}
	}()
}

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
		log.Info().Str("namespace", namespace).Msg(format + "\n" + fmt.Sprintf("%v", a))
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

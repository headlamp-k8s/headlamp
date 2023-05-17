package helm

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
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

var (
	_                  genericclioptions.RESTClientGetter = &restConfigGetter{}
	settings                                              = cli.New()
	statusCacheTimeout                                    = 20 * time.Minute
)

type Handler struct {
	*action.Configuration
	*cli.EnvSettings
	Cache cache.Cache
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

func NewHandler(clientConfig clientcmd.ClientConfig, cache cache.Cache, namespace string) (*Handler, error) {
	return NewHandlerWithSettings(clientConfig, cache, namespace, settings)
}

func NewHandlerWithSettings(clientConfig clientcmd.ClientConfig,
	cache cache.Cache,
	namespace string, settings *cli.EnvSettings,
) (*Handler, error) {
	actionConfig, err := NewActionConfig(clientConfig, namespace)
	if err != nil {
		return nil, err
	}

	return &Handler{
		Configuration: actionConfig,
		EnvSettings:   settings,
		Cache:         cache,
	}, nil
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

type stat struct {
	Status string
	Err    error
}

// getReleaseStatus returns the status of the release.
func (h *Handler) getReleaseStatus(actionName, releaseName string) (*stat, error) {
	key := "helm_" + actionName + "_" + releaseName

	value, err := h.Cache.Get(context.Background(), key)
	if err != nil {
		return nil, err
	}

	valueBytes, err := json.Marshal(value)
	if err != nil {
		return nil, err
	}

	var stat stat

	err = json.Unmarshal(valueBytes, &stat)
	if err != nil {
		return nil, err
	}

	return &stat, nil
}

// setReleaseStatus sets the status of the release
// Key of the object is action_name + "_" + release_name
// action_name is the name of the action, e.g. install, upgrade, delete
// status is one of the following: processing, success, failed.
func (h *Handler) setReleaseStatus(actionName, releaseName, status string, err error) error {
	key := "helm_" + actionName + "_" + releaseName

	stat := stat{
		Status: status,
		Err:    err,
	}

	cacheErr := h.Cache.SetWithTTL(context.Background(), key, stat, statusCacheTimeout)
	if cacheErr != nil {
		return cacheErr
	}

	return nil
}

func (h *Handler) setReleaseStatusSilent(actionName, releaseName, status string, err error) {
	cacheErr := h.setReleaseStatus(actionName, releaseName, status, err)
	if cacheErr != nil {
		log.Error().Err(cacheErr).Str("action", actionName).
			Str("releaseName", releaseName).Str("status", status).
			Msg("unable to set status")
	}
}

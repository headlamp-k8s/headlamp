package main

import (
	"os"
	"strings"

	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/headlamp-k8s/headlamp/backend/pkg/logger"
)

func main() {
	conf, err := config.Parse(os.Args)
	if err != nil {
		logger.Log(logger.LevelError, nil, err, "fetching config:%v")
		os.Exit(1)
	}

	cache := cache.New[interface{}]()
	kubeConfigStore := kubeconfig.NewContextStore()

	StartHeadlampServer(&HeadlampConfig{
		useInCluster:          conf.InCluster,
		kubeConfigPath:        conf.KubeConfigPath,
		port:                  conf.Port,
		devMode:               conf.DevMode,
		staticDir:             conf.StaticDir,
		insecure:              conf.InsecureSsl,
		pluginDir:             conf.PluginsDir,
		oidcClientID:          conf.OidcClientID,
		oidcClientSecret:      conf.OidcClientSecret,
		oidcIdpIssuerURL:      conf.OidcIdpIssuerURL,
		oidcScopes:            strings.Split(conf.OidcScopes, ","),
		baseURL:               conf.BaseURL,
		proxyURLs:             strings.Split(conf.ProxyURLs, ","),
		enableHelm:            conf.EnableHelm,
		enableDynamicClusters: conf.EnableDynamicClusters,
		cache:                 cache,
		kubeConfigStore:       kubeConfigStore,
	})
}

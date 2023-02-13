package main

import (
	"log"
	"os"
	"strings"

	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
)

func main() {
	conf, err := config.Parse(os.Args)
	if err != nil {
		log.Fatalf("Error fetching config:%v", err)
	}

	StartHeadlampServer(&HeadlampConfig{
		useInCluster:     conf.InCluster,
		kubeConfigPath:   conf.KubeConfigPath,
		port:             conf.Port,
		devMode:          conf.DevMode,
		staticDir:        conf.StaticDir,
		insecure:         conf.InsecureSsl,
		pluginDir:        conf.PluginsDir,
		oidcClientID:     conf.OidcClientID,
		oidcClientSecret: conf.OidcClientSecret,
		oidcIdpIssuerURL: conf.OidcIdpIssuerURL,
		oidcScopes:       strings.Split(conf.OidcScopes, ","),
		baseURL:          conf.BaseURL,
		proxyURLs:        strings.Split(conf.ProxyURLs, ","),
	})
}

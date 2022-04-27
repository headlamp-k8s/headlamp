package main

import (
	"flag"
	"log"
	"strings"
)

func main() {
	kubeconfig := flag.String("kubeconfig", "", "Absolute path to the kubeconfig file")
	inCluster := flag.Bool("in-cluster", false, "Set when running from a k8s cluster")
	devMode := flag.Bool("dev", false, "Allow connections from other origins")
	staticDir := flag.String("html-static-dir", "", "Static HTML directory to serve")
	insecure := flag.Bool("insecure-ssl", false, "Accept/Ignore all server SSL certificates")
	// @todo: Make this a uint and validate the values
	port := flag.String("port", "4466", "Port to listen from")
	pluginDir := flag.String("plugins-dir", defaultPluginDir(), "Specify the plugins directory to build the backend with")
	// For inCluster config we need to get the oidc properties from the flags
	oidcClientID := flag.String("oidc-client-id", "", "ClientID for OIDC")
	oidcClientSecret := flag.String("oidc-client-secret", "", "ClientSecret for OIDC")
	oidcIdpIssuerURL := flag.String("oidc-idp-issuer-url", "", "Identity provider issuer URL for OIDC")
	// The profile and email scopes are default, but we keep them here for maximum control by the caller.
	oidcScopes := flag.String("oidc-scopes", "profile,email",
		"A comma separated list of scopes needed from the OIDC provider")
	baseURL := flag.String("base-url", "", "Base URL path. eg. /headlamp")

	flag.Parse()

	if !*inCluster &&
		(*oidcClientID != "" || *oidcClientSecret != "" || *oidcIdpIssuerURL != "") {
		log.Fatal(`oidc-client-id, oidc-client-secret, oidc-idp-issuer-url
		 flags are only meant to be used in inCluster mode`)
	}

	if *baseURL != "" && !strings.HasPrefix(*baseURL, "/") {
		log.Fatal("base-url needs to start with a '/' or be empty")
	}

	kubeConfigPath := ""
	// If we don't have a specified kubeConfig path, and we are not running
	// in-cluster, then use the default path.
	if *kubeconfig != "" {
		kubeConfigPath = *kubeconfig
	} else if !*inCluster {
		kubeConfigPath = GetDefaultKubeConfigPath()
	}

	StartHeadlampServer(&HeadlampConfig{
		useInCluster:     *inCluster,
		kubeConfigPath:   kubeConfigPath,
		port:             *port,
		devMode:          *devMode,
		staticDir:        *staticDir,
		insecure:         *insecure,
		pluginDir:        *pluginDir,
		oidcClientID:     *oidcClientID,
		oidcClientSecret: *oidcClientSecret,
		oidcIdpIssuerURL: *oidcIdpIssuerURL,
		oidcScopes:       strings.Split(*oidcScopes, ","),
		baseURL:          *baseURL,
	})
}

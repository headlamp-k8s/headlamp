package main

import (
	"flag"
	"log"
)

func main() {
	kubeconfig := flag.String("kubeconfig", "", "Absolute path to the kubeconfig file")
	inCluster := flag.Bool("in-cluster", false, "Set when running from a k8s cluster")
	devMode := flag.Bool("dev", false, "Allow connections from other origins")
	staticDir := flag.String("html-static-dir", "", "Static HTML directory to serve")
	insecure := flag.Bool("insecure-ssl", false, "Accept/Ignore all server SSL certificates")
	// @todo: Make this a uint and validate the values
	port := flag.String("port", "4466", "Port to listen from")
	pluginDir := flag.String("plugins-dir", "./plugins", "Specify the plugins directory to build the backend with")
	// For inCluster config we need to get the oidc properties from the flags
	oidcClientID := flag.String("oidc-client-id", "", "ClientID for OIDC")
	oidcClientSecret := flag.String("oidc-client-secret", "", "ClientSecret for OIDC")
	oidcIdpIssuerURL := flag.String("oidc-idp-issuer-url", "", "Identity provider issuer URL for oidc")

	flag.Parse()

	if !*inCluster &&
		(*oidcClientID != "" || *oidcClientSecret != "" || *oidcIdpIssuerURL != "") {
		log.Fatal(`oidc-client-id, oidc-client-secret, oidc-idp-issuer-url 
		 flags are only meant to be used in inCluster mode`)
	}

	StartHeadlampServer(&HeadlampConfig{
		useInCluster:     *inCluster,
		kubeConfigPath:   *kubeconfig,
		port:             *port,
		devMode:          *devMode,
		staticDir:        *staticDir,
		insecure:         *insecure,
		pluginDir:        *pluginDir,
		oidcClientID:     *oidcClientID,
		oidcClientSecret: *oidcClientSecret,
		oidcIdpIssuerURL: *oidcIdpIssuerURL,
	})
}

package main

import (
	"flag"
)

func main() {
	kubeconfig := flag.String("kubeconfig", "", "Absolute path to the kubeconfig file")
	inCluster := flag.Bool("in-cluster", false, "Set when running from a k8s cluster")
	devMode := flag.Bool("dev", false, "Allow connections from other origins")
	staticDir := flag.String("html-static-dir", "", "Static HTML directory to serve")
	insecure := flag.Bool("insecure-ssl", false, "Accept/Ignore all server SSL certificates")
	// @todo: Make this a uint and validate the values
	port := flag.String("port", "4654", "Port to listen from")
	pluginDir := flag.String("plugins-dir", "./plugins", "Specify the plugins directory to build the backend with")

	flag.Parse()

	StartHeadlampServer(&HeadlampConfig{
		useInCluster:   *inCluster,
		kubeConfigPath: *kubeconfig,
		port:           *port,
		devMode:        *devMode,
		staticDir:      *staticDir,
		insecure:       *insecure,
		pluginDir:      *pluginDir})
}

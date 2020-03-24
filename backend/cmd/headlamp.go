package main

import (
	"fmt"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"crypto/tls"
	"crypto/x509"
)

type HeadlampConfig struct {
	useInCluster   bool
	kubeConfigPath string
	port           string
	devMode        bool
	staticDir      string
	insecure       bool
}

func StartHeadlampServer(config *HeadlampConfig) {
	kubeConfigPath := ""

	// If we don't have a specified kubeConfig path, and we are not running
	// in-cluster, then use the default path.
	if config.kubeConfigPath != "" {
		kubeConfigPath = config.kubeConfigPath
	} else if !config.useInCluster {
		kubeConfigPath = GetDefaultKubeConfigPath()
	}

	var clusters []Cluster

	// In-cluster
	if config.useInCluster {
		cluster, err := GetOwnCluster()
		if err != nil {
			log.Fatal("Failed to get in-cluster config", err)
		}

		clusters = append(clusters, *cluster)
	}

	// KubeConfig clusters
	if kubeConfigPath != "" {
		confClusters, err := GetClustersFromKubeConfigFile(kubeConfigPath)
		if err != nil {
			log.Fatal("Failed to get clusters from", kubeConfigPath, err)
		}

		clusters = append(clusters, confClusters...)
	}

	r := mux.NewRouter()

	fmt.Println("*** Headlamp Server ***")
	fmt.Println("  API Routers:")

	for _, cluster := range clusters {
		config.addProxyForCluster(&cluster, r)
	}

	// This is a quick work-around just for compatibility with the frontend until we add multi-cluster support there too
	if len(clusters) > 0 {
		firstCluster := clusters[0]
		firstCluster.Name = ""
		config.addProxyForCluster(&firstCluster, r)
	}

	// Serve the frontend if needed
	if config.staticDir != "" {
		fs := http.FileServer(http.Dir(config.staticDir))
		r.PathPrefix("/").Handler(fs)
	}

	http.Handle("/", r)

	var handler http.Handler

	// On dev mode we're loose about where connections come from
	if config.devMode {
		headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
		methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"})
		origins := handlers.AllowedOrigins([]string{"*"})
		handler = handlers.CORS(headers, methods, origins)(r)
	} else {
		handler = r
	}

	// Start server
	log.Fatal(http.ListenAndServe(":"+config.port, handler))
}

func (c *HeadlampConfig) addProxyForCluster(cluster *Cluster, r *mux.Router) {
	name := cluster.getName()
	server, err := url.Parse(*cluster.getServer())
	if err != nil {
		log.Fatal("Failed to get URL from server", name, err)
	}

	// Create a reverse proxy to direct the API calls to the right server
	proxy := httputil.NewSingleHostReverseProxy(server)

	// Set up certificates for TLS
	rootCAs := x509.NewCertPool()

	shouldVerifyTLS := !c.insecure || cluster.shouldVerifyTLS()
	if shouldVerifyTLS {
		if certificate := cluster.getCAData(); certificate != nil {
			rootCAs.AppendCertsFromPEM(certificate)
		}
	}

	tls := &tls.Config{
		InsecureSkipVerify: shouldVerifyTLS,
		RootCAs:            rootCAs,
	}

	tr := &http.Transport{TLSClientConfig: tls}
	proxy.Transport = tr

	// @todo: Remove distinction when the frontend gets multi-cluster support
	var prefix string
	if *name == "" {
		prefix = "/cluster"
	} else {
		prefix = "/clusters/" + *name
	}

	r.HandleFunc(prefix+"/{api:.*}", proxyHandler(server, proxy))
	fmt.Printf("\tlocalhost:%v%v/{api...} -> %v\n", c.port, prefix, *cluster.getServer())
}

func proxyHandler(url *url.URL, proxy *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
	return func(writer http.ResponseWriter, request *http.Request) {
		request.Host = url.Host
		request.Header.Set("X-Forwarded-Host", request.Header.Get("Host"))
		request.URL.Host = url.Host
		request.URL.Path = mux.Vars(request)["api"]
		request.URL.Scheme = url.Scheme

		log.Println("Requesting ", request.URL.String())
		proxy.ServeHTTP(writer, request)
	}
}

func GetDefaultKubeConfigPath() string {
	return filepath.Join(os.Getenv("HOME"), ".kube", "config")
}

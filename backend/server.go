package main

import (
	"io/ioutil"
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
	"flag"

	_ "k8s.io/client-go/plugin/pkg/client/auth/oidc"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
)

func main() {
	var kubeconfig *string
	if configFile := getKubeConfigFile(); configFile != "" {
		kubeconfig = flag.String("kubeconfig", configFile, "(Optional) absolute path to the kubeconfig file")
	} else {
		kubeconfig = flag.String("kubeconfig", "", "Absolute path to the kubeconfig file")
	}

	inCluster := flag.Bool("in-cluster", false, "Set when running from a k8s cluster")

	devMode := flag.Bool("dev", false, "Allow connections from other origins")

	// @todo: Make this a uint and validate the values
	port := flag.String("port", "4654", "Port to listen from")

	staticDir := flag.String("html-static-dir", "", "Static HTML directory to serve")

	flag.Parse()

	var k8sConfig *rest.Config = nil
	if *inCluster {
		var err error = nil
		k8sConfig, err = rest.InClusterConfig()
		if err != nil {
			panic(err.Error())
		}
	}

	// Use the current context in kubeconfig
	if k8sConfig == nil {
		var err error = nil
		k8sConfig, err = clientcmd.BuildConfigFromFlags("", *kubeconfig)
		if err != nil {
			panic(err)
		}
	}

	// Get the server URL
	serverURL := k8sConfig.Host
	remote, err := url.Parse(serverURL)
	if err != nil {
		panic(err)
	}

	insecure := flag.Bool("insecure-ssl", false, "Accept/Ignore all server SSL certificates")
	flag.Parse()

	// Set up certificates for TLS
	rootCAs := x509.NewCertPool()

	if k8sConfig.TLSClientConfig.CAFile != "" {
		if pemBytes, err := ioutil.ReadFile(k8sConfig.TLSClientConfig.CAFile); err == nil {
			ok := rootCAs.AppendCertsFromPEM(pemBytes)
			if !ok {
				log.Println("Failed to add certificate")
			}
		}
	}

	if certificates := k8sConfig.TLSClientConfig.CAData; len(certificates) > 0 {
		if rootCAs.AppendCertsFromPEM(certificates) {
			log.Println("No certificates were found")
		}
	}

	config := &tls.Config{
		InsecureSkipVerify: *insecure,
		RootCAs:            rootCAs,
	}
	tr := &http.Transport{TLSClientConfig: config}

	// Create a reverse proxy to direct the API calls to the right server
	proxy := httputil.NewSingleHostReverseProxy(remote)
	proxy.Transport = tr

	r := mux.NewRouter()
	r.HandleFunc("/cluster/{api:.*}", handler(remote, proxy))

	// Serve the frontend if needed
	if *staticDir != "" {
		fs := http.FileServer(http.Dir(*staticDir))
		r.PathPrefix("/").Handler(fs)
	}

	http.Handle("/", r)

	var handler http.Handler

	// On dev mode we're loose about w
	if *devMode {
		headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
		methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"})
		origins := handlers.AllowedOrigins([]string{"*"})
		handler = handlers.CORS(headers, methods, origins)(r)
	} else {
		handler = r
	}

	log.Println("Lokodash Server:")
	log.Println("API Router:")
	log.Println("\t", "localhost:"+*port+"/cluster/{api...} ->", serverURL)

	// Start server
	log.Fatal(http.ListenAndServe(":"+*port, handler))
}

func handler(url *url.URL, proxy *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
	return func(writer http.ResponseWriter, request *http.Request) {
		request.Host = url.Host
		request.Header.Set("X-Forwarded-Host", request.Header.Get("Host"))
		request.URL.Host = url.Host
		request.URL.Path = mux.Vars(request)["api"]
		request.URL.Scheme = url.Scheme

		log.Println("Requesting ", request.URL.Scheme, request.URL.Host, mux.Vars(request)["api"])
		proxy.ServeHTTP(writer, request)
	}
}

func getKubeConfigFile() string {
	return filepath.Join(os.Getenv("HOME"), ".kube", "config")
}

package main

import (
	"encoding/json"
	"fmt"
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
)

type HeadlampConfig struct {
	useInCluster   bool
	kubeConfigPath string
	port           string
	devMode        bool
	staticDir      string
	insecure       bool
	pluginDir      string
}

type clientConfig struct {
	Clusters []Cluster `json:"clusters"`
}

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// get the absolute path to prevent directory traversal
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		// if we failed to get the absolute path respond with a 400 bad request
		// and stop
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	// prepend the path with the path to the static directory
	path = filepath.Join(h.staticPath, path)

	// check whether a file exists at the given path
	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		// file does not exist, serve index.html
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		// if we got an error (that wasn't that the file doesn't exist) stating the
		// file, return a 500 internal server error and stop
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// otherwise, use http.FileServer to serve the static dir
	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
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

	var contexts []Context

	// In-cluster
	if config.useInCluster {
		context, err := GetOwnContext()
		if err != nil {
			log.Fatal("Failed to get in-cluster config", err)
		}

		contexts = append(contexts, *context)
	}

	// KubeConfig clusters
	if kubeConfigPath != "" {
		var err error
		contextsFound, err := GetContextsFromKubeConfigFile(kubeConfigPath)
		if err != nil {
			log.Fatal("Failed to get contexts from", kubeConfigPath, err)
		}

		contexts = append(contexts, contextsFound...)
	}

	clusters := make([]Cluster, 0, len(contexts))
	for _, context := range contexts {
		clusters = append(clusters, *context.getCluster())
	}

	clientConf := &clientConfig{clusters}
	r := mux.NewRouter()

	fmt.Println("*** Headlamp Server ***")
	fmt.Println("  API Routers:")

	for _, context := range contexts {
		config.addProxyForContext(&context, r)
	}

	var pluginListURLS []string
	files, err := ioutil.ReadDir(config.pluginDir)
	if err != nil {
		log.Println("Error: ", err)
	}
	for _, f := range files {
		pluginFileURL := filepath.Join("/plugins", f.Name(), "main.js")
		pluginListURLS = append(pluginListURLS, pluginFileURL)
	}
	r.HandleFunc("/plugins/list", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(pluginListURLS); err != nil {
			log.Println("Error encoding plugins list", err)
		}
	}).Methods("GET")

	// Serve plugins
	r.PathPrefix("/plugins/").Handler(http.StripPrefix("/plugins/", http.FileServer(http.Dir(config.pluginDir))))

	// Configuration
	r.HandleFunc("/config", clientConf.getConfig).Methods("GET")

	// Serve the frontend if needed
	spa := spaHandler{staticPath: config.staticDir, indexPath: "index.html"}
	r.PathPrefix("/").Handler(spa)

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

// @todo: Evaluate whether we should just spawn a kubectl proxy for each context
// as it would handle already the certificates, etc.
func (c *HeadlampConfig) addProxyForContext(context *Context, r *mux.Router) {
	cluster := context.getCluster()
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

	var certs []tls.Certificate

	// We allow the use of client certificates now, so let's try to load them
	// if they exist.
	clientCert := context.getClientCertificate()
	if clientCert != "" {
		clientKey := context.getClientKey()
		if clientKey == "" {
			log.Fatalf("Found a ClientCertificate entry for cluster %v, but not a ClientKey.", name)
		} else {
			cert, err := tls.LoadX509KeyPair(clientCert, clientKey)
			if err == nil {
				certs = append(certs, cert)
			}
		}
	}

	clientCertData := context.getClientCertificateData()
	if clientCertData != nil {
		clientKeyData := context.getClientKeyData()
		if clientKeyData == nil {
			log.Fatalf("Found a ClientCertificateData entry for cluster %v, but not a ClientKeyData.", name)
		} else {
			cert, err := tls.X509KeyPair(clientCertData, clientKeyData)
			if err == nil {
				certs = append(certs, cert)
			}
		}
	}

	tls := &tls.Config{
		InsecureSkipVerify: shouldVerifyTLS,
		RootCAs:            rootCAs,
		Certificates:       certs,
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

func (c *clientConfig) getConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(c); err != nil {
		log.Println("Error encoding config", err)
	}
}

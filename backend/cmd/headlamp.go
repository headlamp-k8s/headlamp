package main

import (
	"context"
	"crypto/tls"
	"crypto/x509"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"path/filepath"

	oidc "github.com/coreos/go-oidc"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"

	"golang.org/x/oauth2"
)

type HeadlampConfig struct {
	useInCluster     bool
	devMode          bool
	insecure         bool
	kubeConfigPath   string
	port             string
	staticDir        string
	pluginDir        string
	oidcClientID     string
	oidcClientSecret string
	oidcIdpIssuerURL string
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

// nolint:gocognit,funlen
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
		context, err := GetOwnContext(config)
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

	for i := range contexts {
		config.addProxyForContext(&contexts[i], r)
	}

	files, err := ioutil.ReadDir(config.pluginDir)
	if err != nil {
		log.Println("Error: ", err)
	}

	pluginListURLS := make([]string, 0, len(files))

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

	oauthRequestMap := make(map[string]*OauthConfig)

	r.HandleFunc("/oidc", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		cluster := r.URL.Query().Get("cluster")
		if config.insecure {
			tr := &http.Transport{
				TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, // nolint:gosec
			}
			insecureClient := &http.Client{Transport: tr}
			ctx = oidc.ClientContext(ctx, insecureClient)
		}

		oidcAuthConfig, err := GetClusterOidcConfig(cluster)
		if err != nil {
			log.Printf("Error getting %s cluster oidc config %s", cluster, err)
		}
		provider, err := oidc.NewProvider(ctx, oidcAuthConfig.IdpIssuerURL)
		if err != nil {
			log.Printf("Error while fetching the provider from %s error %s", oidcAuthConfig.IdpIssuerURL, err)
		}

		oidcConfig := &oidc.Config{
			ClientID: oidcAuthConfig.ClientID,
		}

		urlScheme := r.URL.Scheme
		if urlScheme == "" {
			// @todo: Find a better way to get the scheme for the URL.
			if r.Host == "localhost:"+config.port {
				urlScheme = "http"
			} else {
				urlScheme = "https"
			}
		}

		verifier := provider.Verifier(oidcConfig)
		oauthConfig := &oauth2.Config{
			ClientID:     oidcAuthConfig.ClientID,
			ClientSecret: oidcAuthConfig.ClientSecret,
			Endpoint:     provider.Endpoint(),
			RedirectURL:  fmt.Sprintf("%1s://%2s/oidc-callback", urlScheme, r.Host),
			Scopes:       []string{oidc.ScopeOpenID, "profile", "email", "groups"},
		}

		state := cluster
		if err != nil {
			log.Printf("Error getting oauthConfig for cluster %s error %s", cluster, err)
		}

		oauthRequestMap[state] = &OauthConfig{Config: oauthConfig, Verifier: verifier, Ctx: ctx}

		http.Redirect(w, r, oauthConfig.AuthCodeURL(state), http.StatusFound)
	}).Queries("cluster", "{cluster}")

	r.HandleFunc("/oidc-callback", func(w http.ResponseWriter, r *http.Request) {
		state := r.URL.Query().Get("state")
		if state == "" {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
		// nolint: nestif
		if oauthConfig, ok := oauthRequestMap[state]; ok {
			oauth2Token, err := oauthConfig.Config.Exchange(oauthConfig.Ctx, r.URL.Query().Get("code"))
			if err != nil {
				http.Error(w, "Failed to exchange token: "+err.Error(), http.StatusInternalServerError)
				return
			}

			rawIDToken, ok := oauth2Token.Extra("id_token").(string)
			if !ok {
				http.Error(w, "No id_token field in oauth2 token.", http.StatusInternalServerError)
				return
			}

			idToken, err := oauthConfig.Verifier.Verify(oauthConfig.Ctx, rawIDToken)
			if err != nil {
				http.Error(w, "Failed to verify ID Token: "+err.Error(), http.StatusInternalServerError)
				return
			}

			resp := struct {
				OAuth2Token   *oauth2.Token
				IDTokenClaims *json.RawMessage // ID Token payload is just JSON.
			}{oauth2Token, new(json.RawMessage)}

			if err := idToken.Claims(&resp.IDTokenClaims); err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			var redirectURL string
			if config.devMode {
				redirectURL = "http://localhost:3000/"
			} else {
				redirectURL = "/"
			}

			redirectURL += fmt.Sprintf("auth?cluster=%1s&token=%2s", state, oauth2Token.AccessToken)
			http.Redirect(w, r, redirectURL, http.StatusSeeOther)
		} else {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
	})

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
		} else if cert, err := tls.LoadX509KeyPair(clientCert, clientKey); err == nil {
			certs = append(certs, cert)
		}
	}

	clientCertData := context.getClientCertificateData()
	if clientCertData != nil {
		clientKeyData := context.getClientKeyData()
		if clientKeyData == nil {
			log.Fatalf("Found a ClientCertificateData entry for cluster %v, but not a ClientKeyData.", name)
		} else if cert, err := tls.X509KeyPair(clientCertData, clientKeyData); err == nil {
			certs = append(certs, cert)
		}
	}

	tls := &tls.Config{
		InsecureSkipVerify: shouldVerifyTLS, // nolint:gosec
		RootCAs:            rootCAs,
		Certificates:       certs,
	}

	proxy.Transport = &http.Transport{TLSClientConfig: tls}

	prefix := "/clusters/" + *name

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

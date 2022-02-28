package main

import (
	"bytes"
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
	"os/user"
	"path"
	"path/filepath"
	"strings"

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
	oidcScopes       []string
	oidcIdpIssuerURL string
	baseURL          string
}

type clientConfig struct {
	Clusters []Cluster `json:"clusters"`
}

type spaHandler struct {
	staticPath string
	indexPath  string
	baseURL    string
}

var pluginListURLs []string

func resetPlugins() {
	pluginListURLs = nil
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

	path = strings.TrimPrefix(path, h.baseURL)

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

	// The file does exist, so we serve that.
	http.ServeFile(w, r, path)
}

// returns True if a file exists.
func fileExists(filename string) bool {
	info, err := os.Stat(filename)
	if os.IsNotExist(err) {
		return false
	}

	return !info.IsDir()
}

// copy a file, whilst doing some search/replace on the data.
func copyReplace(src string, dst string,
	search []byte, replace []byte,
	search2 []byte, replace2 []byte) {
	data, err := ioutil.ReadFile(src)
	if err != nil {
		log.Fatal(err)
	}

	data1 := bytes.ReplaceAll(data, search, replace)
	data2 := bytes.ReplaceAll(data1, search2, replace2)

	err = ioutil.WriteFile(dst, data2, 0600)
	if err != nil {
		log.Fatal(err)
	}
}

// make sure the base-url is updated in the index.html file.
func baseURLReplace(staticDir string, baseURL string) {
	indexBaseURL := path.Join(staticDir, "index.baseUrl.html")
	index := path.Join(staticDir, "index.html")

	replaceURL := baseURL
	if baseURL == "" {
		// We have to do the replace when baseURL == "" because of the case when
		//   someone first does a different baseURL. If we didn't it would stay stuck
		//   on that previous baseURL.
		replaceURL = "/"
	}

	if !fileExists(indexBaseURL) {
		copyReplace(index, indexBaseURL, []byte(""), []byte(""), []byte(""), []byte(""))
	}

	copyReplace(indexBaseURL,
		index,
		[]byte("./"),
		[]byte(baseURL+"/"),
		[]byte("headlampBaseUrl=\".\""),
		[]byte("headlampBaseUrl=\""+replaceURL+"\""))
}

func getOidcCallbackURL(r *http.Request, config *HeadlampConfig) string {
	urlScheme := r.URL.Scheme
	if urlScheme == "" {
		// check proxy headers first
		fwdProto := r.Header.Get("X-Forwarded-Proto")

		switch {
		case fwdProto != "":
			urlScheme = fwdProto
		case strings.HasPrefix(r.Host, "localhost:") || r.TLS == nil:
			urlScheme = "http"
		default:
			urlScheme = "https"
		}
	}

	// Clean up + add the base URL to the redirect URL
	hostWithBaseURL := strings.Trim(r.Host, "/")
	baseURL := strings.Trim(config.baseURL, "/")

	if baseURL != "" {
		hostWithBaseURL = hostWithBaseURL + "/" + baseURL
	}

	return fmt.Sprintf("%s://%s/oidc-callback", urlScheme, hostWithBaseURL)
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

	log.Printf("plugins-dir: %s\n", config.pluginDir)

	if !config.useInCluster {
		// in-cluster mode is unlikely to want reloading plugins.
		go watchForChanges(config.pluginDir)
	}

	var contexts []Context

	// In-cluster
	if config.useInCluster {
		context, err := GetOwnContext(config)
		if err != nil {
			log.Println("Failed to get in-cluster config", err)
		}

		contexts = append(contexts, *context)
	}

	// KubeConfig clusters
	if kubeConfigPath != "" {
		var err error

		contextsFound, err := GetContextsFromKubeConfigFile(kubeConfigPath)
		if err != nil {
			log.Println("Failed to get contexts from", kubeConfigPath, err)
		}

		contexts = append(contexts, contextsFound...)
	}

	clusters := make([]Cluster, 0, len(contexts))
	for _, context := range contexts {
		clusters = append(clusters, *context.getCluster())
	}

	clientConf := &clientConfig{clusters}

	if config.staticDir != "" {
		baseURLReplace(config.staticDir, config.baseURL)
	}

	// For when using a base-url, like "/headlamp" with a reverse proxy.
	var r *mux.Router
	if config.baseURL == "" {
		r = mux.NewRouter()
	} else {
		baseRoute := mux.NewRouter()
		r = baseRoute.PathPrefix(config.baseURL).Subrouter()
	}

	fmt.Println("*** Headlamp Server ***")
	fmt.Println("  API Routers:")

	for i := range contexts {
		config.addProxyForContext(&contexts[i], r)
	}

	var err error

	pluginListURLs, err = config.getPluginListURLs()
	if err != nil {
		if !os.IsNotExist(err) {
			log.Println("Error: ", err)
		}
		// There was error, but we don't want to keep checking the plugins
		// again, until we deliberately do (so making the list an empty one).
		pluginListURLs = make([]string, 0)
	}

	r.HandleFunc("/plugins/list", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		// The pluginListURLs should only be nil if we want to dynamically load it
		// (and that's available only when not running in-cluster).
		if !config.useInCluster && pluginListURLs == nil {
			pluginListURLs, _ = config.getPluginListURLs()
		}
		if err := json.NewEncoder(w).Encode(pluginListURLs); err != nil {
			log.Println("Error encoding plugins list", err)
		}
	}).Methods("GET")

	// Serve plugins
	pluginHandler := http.StripPrefix(config.baseURL+"/plugins/", http.FileServer(http.Dir(config.pluginDir)))
	r.PathPrefix("/plugins/").Handler(pluginHandler)

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
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		provider, err := oidc.NewProvider(ctx, oidcAuthConfig.IdpIssuerURL)
		if err != nil {
			log.Printf("Error while fetching the provider from %s error %s", oidcAuthConfig.IdpIssuerURL, err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		oidcConfig := &oidc.Config{
			ClientID: oidcAuthConfig.ClientID,
		}

		verifier := provider.Verifier(oidcConfig)
		oauthConfig := &oauth2.Config{
			ClientID:     oidcAuthConfig.ClientID,
			ClientSecret: oidcAuthConfig.ClientSecret,
			Endpoint:     provider.Endpoint(),
			RedirectURL:  getOidcCallbackURL(r, config),
			Scopes:       append([]string{oidc.ScopeOpenID}, oidcAuthConfig.Scopes...),
		}

		oauthRequestMap[cluster] = &OauthConfig{Config: oauthConfig, Verifier: verifier, Ctx: ctx}

		http.Redirect(w, r, oauthConfig.AuthCodeURL(cluster), http.StatusFound)
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

			redirectURL += fmt.Sprintf("auth?cluster=%1s&token=%2s", state, rawIDToken)
			http.Redirect(w, r, redirectURL, http.StatusSeeOther)
		} else {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
	})

	// Serve the frontend if needed
	spa := spaHandler{staticPath: config.staticDir, indexPath: "index.html", baseURL: config.baseURL}
	r.PathPrefix("/").Handler(spa)

	http.Handle("/", r)

	var handler http.Handler

	// On dev mode we're loose about where connections come from
	if config.devMode {
		headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization"})
		methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "PATCH", "OPTIONS"})
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
	fmt.Printf("\tlocalhost:%v%v%v/{api...} -> %v\n", c.port, c.baseURL, prefix, *cluster.getServer())
}

func setPluginReloadHeader(writer http.ResponseWriter) {
	// We signal back to the frontend through a header.
	// See apiProxy.ts in the frontend for how it handles this.
	log.Println("Sending reload plugins signal to frontend")

	// Allow JavaScript access to X-Reload header. Because denied by default.
	writer.Header().Set("Access-Control-Expose-Headers", "X-Reload")
	writer.Header().Set("X-Reload", "reload")
}

func proxyHandler(url *url.URL, proxy *httputil.ReverseProxy) func(http.ResponseWriter, *http.Request) {
	return func(writer http.ResponseWriter, request *http.Request) {
		request.Host = url.Host
		request.Header.Set("X-Forwarded-Host", request.Header.Get("Host"))
		request.URL.Host = url.Host
		request.URL.Path = mux.Vars(request)["api"]
		request.URL.Scheme = url.Scheme

		if pluginsChanged() {
			resetPlugins()
			setPluginReloadHeader(writer)
		}

		log.Println("Requesting ", request.URL.String())
		proxy.ServeHTTP(writer, request)
	}
}

func GetDefaultKubeConfigPath() string {
	user, err := user.Current()
	if err != nil {
		log.Fatalf(err.Error())
	}

	homeDirectory := user.HomeDir

	return filepath.Join(homeDirectory, ".kube", "config")
}

func (c *clientConfig) getConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if err := json.NewEncoder(w).Encode(c); err != nil {
		log.Println("Error encoding config", err)
	}
}

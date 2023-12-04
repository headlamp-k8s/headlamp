package main

import (
	"bytes"
	"compress/gzip"
	"context"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"path"
	"path/filepath"
	"runtime"
	"strings"
	"time"

	oidc "github.com/coreos/go-oidc"
	"github.com/gobwas/glob"
	"github.com/google/uuid"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/helm"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/headlamp-k8s/headlamp/backend/pkg/plugins"
	"github.com/headlamp-k8s/headlamp/backend/pkg/portforward"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/client-go/kubernetes"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"

	zlog "github.com/rs/zerolog/log"
	"golang.org/x/oauth2"
)

type HeadlampConfig struct {
	useInCluster          bool
	devMode               bool
	insecure              bool
	enableHelm            bool
	enableDynamicClusters bool
	port                  uint
	kubeConfigPath        string
	staticDir             string
	pluginDir             string
	staticPluginDir       string
	oidcClientID          string
	oidcClientSecret      string
	oidcIdpIssuerURL      string
	baseURL               string
	oidcScopes            []string
	proxyURLs             []string
	cache                 cache.Cache[interface{}]
	kubeConfigStore       kubeconfig.ContextStore
}

const DrainNodeCacheTTL = 20 // seconds

const isWindows = runtime.GOOS == "windows"

type clientConfig struct {
	Clusters []Cluster `json:"clusters"`
}

type spaHandler struct {
	staticPath string
	indexPath  string
	baseURL    string
}

type OauthConfig struct {
	Config   *oauth2.Config
	Verifier *oidc.IDTokenVerifier
	Ctx      context.Context
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// Clean the path to prevent directory traversal
	path := filepath.Clean(r.URL.Path)
	path = strings.TrimPrefix(path, h.baseURL)

	// prepend the path with the path to the static directory
	path = filepath.Join(h.staticPath, path)

	// check whether a file exists at the given path
	_, err := os.Stat(path)
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
	search2 []byte, replace2 []byte,
) {
	data, err := os.ReadFile(src)
	if err != nil {
		log.Fatal(err)
	}

	data1 := bytes.ReplaceAll(data, search, replace)
	data2 := bytes.ReplaceAll(data1, search2, replace2)
	fileMode := 0o600

	err = os.WriteFile(dst, data2, fs.FileMode(fileMode))
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

func serveWithNoCacheHeader(fs http.Handler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Cache-Control", "no-cache")
		fs.ServeHTTP(w, r)
	}
}

// defaultKubeConfigPersistenceDir returns the default directory to store kubeconfig
// files of clusters that are loaded in Headlamp.
func defaultKubeConfigPersistenceDir() (string, error) {
	userConfigDir, err := os.UserConfigDir()
	if err == nil {
		kubeConfigDir := filepath.Join(userConfigDir, "Headlamp", "kubeconfigs")
		if isWindows {
			// golang is wrong for config folder on windows.
			// This matches env-paths and headlamp-plugin.
			kubeConfigDir = filepath.Join(userConfigDir, "Headlamp", "Config", "kubeconfigs")
		}

		// Create the directory if it doesn't exist.
		fileMode := 0o755

		err = os.MkdirAll(kubeConfigDir, fs.FileMode(fileMode))
		if err == nil {
			return kubeConfigDir, nil
		}
	}

	// if any error occurred, fallback to the current directory.
	ex, err := os.Executable()
	if err == nil {
		return filepath.Dir(ex), nil
	}

	return "", fmt.Errorf("failed to get default kubeconfig persistence directory: %v", err)
}

func defaultKubeConfigPersistenceFile() (string, error) {
	kubeConfigDir, err := defaultKubeConfigPersistenceDir()
	if err != nil {
		return "", err
	}

	return filepath.Join(kubeConfigDir, "config"), nil
}

// addPluginRoutes adds plugin routes to a router.
// It serves plugin list base paths as json at “/plugins”.
// It serves plugin static files at “/plugins/” and “/static-plugins/”.
// It disables caching and reloads plugin list base paths if not in-cluster.
func addPluginRoutes(config *HeadlampConfig, r *mux.Router) {
	r.HandleFunc("/plugins", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		pluginsList, err := config.cache.Get(context.Background(), plugins.PluginListKey)
		if err != nil && err == cache.ErrNotFound {
			pluginsList = []string{}
		}
		if err := json.NewEncoder(w).Encode(pluginsList); err != nil {
			log.Println("Error encoding plugins base paths list", err)
		}
	}).Methods("GET")

	// Serve plugins
	pluginHandler := http.StripPrefix(config.baseURL+"/plugins/", http.FileServer(http.Dir(config.pluginDir)))
	// If we're running locally, then do not cache the plugins. This ensures that reloading them (development,
	// update) will actually get the new content.
	if !config.useInCluster {
		pluginHandler = serveWithNoCacheHeader(pluginHandler)
	}

	r.PathPrefix("/plugins/").Handler(pluginHandler)

	if config.staticPluginDir != "" {
		staticPluginsHandler := http.StripPrefix(config.baseURL+"/static-plugins/",
			http.FileServer(http.Dir(config.staticPluginDir)))
		r.PathPrefix("/static-plugins/").Handler(staticPluginsHandler)
	}
}

//nolint:gocognit,funlen,gocyclo
func createHeadlampHandler(config *HeadlampConfig) http.Handler {
	kubeConfigPath := config.kubeConfigPath

	config.staticPluginDir = os.Getenv("HEADLAMP_STATIC_PLUGINS_DIR")

	log.Printf("static plugin dir: %s\n", config.staticPluginDir)
	log.Printf("plugins-dir: %s\n", config.pluginDir)
	log.Printf("dynamic clusters support: %v\n", config.enableDynamicClusters)
	log.Printf("Helm support: %v\n", config.enableHelm)
	log.Printf("Proxy URLs: %+v\n", config.proxyURLs)

	plugins.PopulatePluginsCache(config.baseURL, config.staticPluginDir, config.pluginDir, config.cache)

	if !config.useInCluster {
		// in-cluster mode is unlikely to want reloading plugins.
		pluginEventChan := make(chan string)
		go plugins.Watch(config.pluginDir, pluginEventChan)
		go plugins.HandlePluginEvents(config.baseURL, config.staticPluginDir, config.pluginDir, pluginEventChan, config.cache)
		// in-cluster mode is unlikely to want reloading kubeconfig.
		go kubeconfig.LoadAndWatchFiles(config.kubeConfigStore, kubeConfigPath, kubeconfig.KubeConfig)
	}

	// In-cluster
	if config.useInCluster {
		context, err := kubeconfig.GetInClusterContext(config.oidcIdpIssuerURL,
			config.oidcClientID, config.oidcClientSecret,
			strings.Join(config.oidcScopes, ","))
		if err != nil {
			log.Println("Failed to get in-cluster config", err)
		}

		context.Source = kubeconfig.InCluster

		err = context.SetupProxy()
		if err != nil {
			log.Println("Failed to setup proxy for in-cluster context", err)
		}

		err = config.kubeConfigStore.AddContext(context)
		if err != nil {
			log.Println("Failed to add in-cluster context", err)
		}
	}

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

	// load kubeConfig clusters
	err := kubeconfig.LoadAndStoreKubeConfigs(config.kubeConfigStore, kubeConfigPath, kubeconfig.KubeConfig)
	if err != nil {
		log.Printf("Error loading kubeconfig: %v", err)
	}

	// load dynamic clusters
	kubeConfigPersistenceFile, err := defaultKubeConfigPersistenceFile()
	if err != nil {
		log.Printf("Error getting default kubeconfig persistence directory: %v", err)
	}

	err = kubeconfig.LoadAndStoreKubeConfigs(config.kubeConfigStore, kubeConfigPersistenceFile, kubeconfig.DynamicCluster)
	if err != nil {
		log.Printf("Error loading dynamic kubeconfig file: %v", err)
	}

	addPluginRoutes(config, r)

	config.handleClusterRequests(r)

	r.HandleFunc("/externalproxy", func(w http.ResponseWriter, r *http.Request) {
		proxyURL := r.Header.Get("proxy-to")
		if proxyURL == "" && r.Header.Get("Forward-to") != "" {
			proxyURL = r.Header.Get("Forward-to")
		}
		if proxyURL == "" {
			zlog.Error().Err(err).
				Str("action", "externalproxy").
				Str("proxyURL", proxyURL).
				Msg("proxy URL is empty")
			http.Error(w, "proxy URL is empty", http.StatusBadRequest)
			return
		}
		url, err := url.Parse(proxyURL)
		if err != nil {
			zlog.Error().Err(err).
				Str("action", "externalproxy").
				Str("proxyURL", proxyURL).
				Msg("The provided proxy URL is invalid")
			http.Error(w, fmt.Sprintf("The provided proxy URL is invalid: %v", err), http.StatusBadRequest)
			return
		}
		isURLContainedInProxyURLs := false
		for _, proxyURL := range config.proxyURLs {
			g := glob.MustCompile(proxyURL)
			if g.Match(url.String()) {
				isURLContainedInProxyURLs = true
				break
			}
		}
		if !isURLContainedInProxyURLs {
			zlog.Error().Err(err).Str("action", "externalproxy").Msg("no allowed proxy url match, request denied")
			http.Error(w, "no allowed proxy url match, request denied ", http.StatusBadRequest)
		}

		ctx := context.Background()
		proxyReq, err := http.NewRequestWithContext(ctx, r.Method, proxyURL, r.Body)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		// We may want to filter some headers, otherwise we could just use a shallow copy
		proxyReq.Header = make(http.Header)
		for h, val := range r.Header {
			proxyReq.Header[h] = val
		}

		// Disable caching
		w.Header().Set("Cache-Control", "no-cache, private, max-age=0")
		w.Header().Set("Expires", time.Unix(0, 0).Format(http.TimeFormat))
		w.Header().Set("Pragma", "no-cache")
		w.Header().Set("X-Accel-Expires", "0")

		client := http.Client{}
		resp, err := client.Do(proxyReq)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		defer resp.Body.Close()

		// Check that the server actually sent compressed data
		var reader io.ReadCloser
		switch resp.Header.Get("Content-Encoding") {
		case "gzip":
			reader, err = gzip.NewReader(resp.Body)
			if err != nil {
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			defer reader.Close()
		default:
			reader = resp.Body
		}
		respBody, err := io.ReadAll(reader)
		if err != nil {
			http.Error(w, err.Error(), http.StatusBadGateway)
			return
		}
		_, err = w.Write(respBody)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}
		defer resp.Body.Close()
	})

	// Configuration
	r.HandleFunc("/config", config.getConfig).Methods("GET")

	config.addClusterSetupRoute(r)

	oauthRequestMap := make(map[string]*OauthConfig)

	r.HandleFunc("/oidc", func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		cluster := r.URL.Query().Get("cluster")
		if config.insecure {
			tr := &http.Transport{
				TLSClientConfig: &tls.Config{InsecureSkipVerify: true}, //nolint:gosec
			}
			insecureClient := &http.Client{Transport: tr}
			ctx = oidc.ClientContext(ctx, insecureClient)
		}

		kContext, err := config.kubeConfigStore.GetContext(cluster)
		if err != nil {
			log.Printf("Error: failed to get context: %s", err)
			http.NotFound(w, r)
			return
		}

		oidcAuthConfig, err := kContext.OidcConfig()
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
		/* we encode the cluster to base64 and set it as state so that when getting redirected
		by oidc we can use this state value to get cluster name
		*/
		state := base64.StdEncoding.EncodeToString([]byte(cluster))
		oauthRequestMap[state] = &OauthConfig{Config: oauthConfig, Verifier: verifier, Ctx: ctx}
		http.Redirect(w, r, oauthConfig.AuthCodeURL(state), http.StatusFound)
	}).Queries("cluster", "{cluster}")

	r.HandleFunc("/portforward", func(w http.ResponseWriter, r *http.Request) {
		portforward.StartPortForward(config.kubeConfigStore, config.cache, w, r)
	}).Methods("POST")

	r.HandleFunc("/portforward", func(w http.ResponseWriter, r *http.Request) {
		portforward.StopOrDeletePortForward(config.cache, w, r)
	}).Methods("DELETE")

	r.HandleFunc("/portforward/list", func(w http.ResponseWriter, r *http.Request) {
		portforward.GetPortForwards(config.cache, w, r)
	})

	r.HandleFunc("/drain-node", config.handleNodeDrain).Methods("POST")
	r.HandleFunc("/drain-node-status",
		config.handleNodeDrainStatus).Methods("GET").Queries("cluster", "{cluster}", "nodeName", "{node}")
	r.HandleFunc("/portforward", func(w http.ResponseWriter, r *http.Request) {
		portforward.GetPortForwardByID(config.cache, w, r)
	}).Methods("GET")

	r.HandleFunc("/oidc-callback", func(w http.ResponseWriter, r *http.Request) {
		state := r.URL.Query().Get("state")
		decodedState, err := base64.StdEncoding.DecodeString(state)
		if err != nil {
			http.Error(w, "wrong state set, invalid request "+err.Error(), http.StatusBadRequest)
		}
		if state == "" {
			http.Error(w, "invalid request state is empty", http.StatusBadRequest)
			return
		}
		//nolint:nestif
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

			baseURL := strings.Trim(config.baseURL, "/")
			if baseURL != "" {
				redirectURL += baseURL + "/"
			}

			redirectURL += fmt.Sprintf("auth?cluster=%1s&token=%2s", decodedState, rawIDToken)
			http.Redirect(w, r, redirectURL, http.StatusSeeOther)
		} else {
			http.Error(w, "invalid request", http.StatusBadRequest)
			return
		}
	})

	// Serve the frontend if needed
	if config.staticDir != "" {
		staticPath := config.staticDir

		if isWindows {
			// We support unix paths on windows. So "frontend/static" works.
			if strings.Contains(config.staticDir, "/") {
				staticPath = filepath.FromSlash(config.staticDir)
			}
		}

		spa := spaHandler{staticPath: staticPath, indexPath: "index.html", baseURL: config.baseURL}
		r.PathPrefix("/").Handler(spa)

		http.Handle("/", r)
	}

	// On dev mode we're loose about where connections come from
	if config.devMode {
		headers := handlers.AllowedHeaders([]string{
			"X-HEADLAMP_BACKEND-TOKEN", "X-Requested-With", "Content-Type",
			"Authorization", "Forward-To",
			"KUBECONFIG", "X-HEADLAMP-USER-ID",
		})
		methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "PATCH", "OPTIONS"})
		origins := handlers.AllowedOrigins([]string{"*"})

		return handlers.CORS(headers, methods, origins)(r)
	}

	return r
}

func StartHeadlampServer(config *HeadlampConfig) {
	handler := createHeadlampHandler(config)

	// Start server
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", config.port), handler)) //nolint:gosec
}

// Returns the helm.Handler given the config and request. Writes http.NotFound if clusterName is not there.
func getHelmHandler(c *HeadlampConfig, w http.ResponseWriter, r *http.Request) (*helm.Handler, error) {
	clusterName := mux.Vars(r)["clusterName"]

	context, err := c.kubeConfigStore.GetContext(clusterName)
	if err != nil {
		http.NotFound(w, r)
		return nil, errors.New("not found")
	}

	namespace := r.URL.Query().Get("namespace")

	helmHandler, err := helm.NewHandler(context.ClientConfig(), c.cache, namespace)
	if err != nil {
		log.Printf("Error: failed to create helm handler: %s", err)
		http.Error(w, "failed to create helm handler", http.StatusInternalServerError)
	}

	return helmHandler, nil
}

// Check request for header "X-HEADLAMP_BACKEND-TOKEN" matches HEADLAMP_BACKEND_TOKEN env
// This check is to prevent access except for from the app.
// The app sets HEADLAMP_BACKEND_TOKEN, and gives the token to the frontend.
func checkHeadlampBackendToken(w http.ResponseWriter, r *http.Request) error {
	backendToken := r.Header.Get("X-HEADLAMP_BACKEND-TOKEN")
	backendTokenEnv := os.Getenv("HEADLAMP_BACKEND_TOKEN")

	if backendToken != backendTokenEnv || backendTokenEnv == "" {
		http.Error(w, "access denied", http.StatusForbidden)
		return errors.New("X-HEADLAMP_BACKEND-TOKEN does not match HEADLAMP_BACKEND_TOKEN")
	}

	return nil
}

//nolint:gocognit,funlen
func handleClusterHelm(c *HeadlampConfig, router *mux.Router) {
	router.PathPrefix("/clusters/{clusterName}/helm/{.*}").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if err := checkHeadlampBackendToken(w, r); err != nil {
			return
		}

		helmHandler, err := getHelmHandler(c, w, r)
		if err != nil {
			return
		}

		// we used nolint:gocognit in this function because...
		//  Perhaps there's a better way to dispatch these?
		path := r.URL.Path
		if strings.HasSuffix(path, "/releases/list") && r.Method == http.MethodGet {
			helmHandler.ListRelease(w, r)
			return
		}
		if strings.HasSuffix(path, "/release/install") && r.Method == http.MethodPost {
			helmHandler.InstallRelease(w, r)
			return
		}
		if strings.HasSuffix(path, "/release/history") && r.Method == http.MethodGet {
			helmHandler.GetReleaseHistory(w, r)
			return
		}
		if strings.HasSuffix(path, "/releases/uninstall") && r.Method == http.MethodDelete {
			helmHandler.UninstallRelease(w, r)
			return
		}
		if strings.HasSuffix(path, "/releases/rollback") && r.Method == http.MethodPut {
			helmHandler.RollbackRelease(w, r)
			return
		}
		if strings.HasSuffix(path, "/releases/upgrade") && r.Method == http.MethodPut {
			helmHandler.UpgradeRelease(w, r)
			return
		}
		if strings.HasSuffix(path, "/releases") && r.Method == http.MethodGet {
			helmHandler.GetRelease(w, r)
			return
		}
		if strings.HasSuffix(path, "/repositories") && r.Method == http.MethodGet {
			helmHandler.ListRepo(w, r)
			return
		}
		if strings.HasSuffix(path, "/repositories") && r.Method == http.MethodPost {
			helmHandler.AddRepo(w, r)
			return
		}
		if strings.HasSuffix(path, "/repositories/remove") && r.Method == http.MethodDelete {
			helmHandler.RemoveRepo(w, r)
			return
		}
		if strings.HasSuffix(path, "/repositories/update") && r.Method == http.MethodPut {
			helmHandler.UpdateRepository(w, r)
			return
		}

		if strings.HasSuffix(path, "/charts") && r.Method == http.MethodGet {
			helmHandler.ListCharts(w, r)
			return
		}

		if strings.HasSuffix(path, "/action/status") && r.Method == http.MethodGet {
			helmHandler.GetActionStatus(w, r)
			return
		}
	})
}

func handleClusterAPI(c *HeadlampConfig, router *mux.Router) { //nolint:funlen
	router.PathPrefix("/clusters/{clusterName}/{api:.*}").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var contextKey string
		clusterName := mux.Vars(r)["clusterName"]

		// checking if kubeConfig exists, if not check if the request headers for kubeConfig information
		kubeConfig := r.Header.Get("KUBECONFIG")

		if kubeConfig != "" && c.enableDynamicClusters {
			// if kubeConfig is set and dynamic clusters are enabled then handle stateless cluster requests
			key, err := c.handleStatelessReq(r, kubeConfig)
			if err != nil {
				log.Println("Error: handling stateless cluster request: ", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			contextKey = key
		} else {
			contextKey = clusterName
		}

		// This means the connection is from websocket so there won't be kubeconfig header.
		// We get the value of X-HEADLAMP-USER-ID from the parameter and append it to the cluster name
		// to get the context key. This is to ensure that the context key is unique for each user.
		if r.Header.Get("Upgrade") == "websocket" {
			// Parse the URL
			u, err := url.Parse(r.URL.String())
			if err != nil {
				log.Println("Error: parsing URL: ", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}

			// Get the query parameters
			queryParams := u.Query()
			// Check if "X-HEADLAMP-USER-ID" parameter is present in the websocket URL.
			userIDparam := queryParams.Get("X-HEADLAMP-USER-ID")
			if userIDparam != "" {
				contextKey = clusterName + userIDparam
			}

			// TODO: authentication add token to request and check.
			// TODO: Store everything in indexDB rather then in session storage.

			// Remove the "X-HEADLAMP-USER-ID" parameter from the websocket URL.
			delete(queryParams, "X-HEADLAMP-USER-ID")
			u.RawQuery = queryParams.Encode()
			r.URL = u
		}

		kContext, err := c.kubeConfigStore.GetContext(contextKey)
		if err != nil {
			log.Printf("Error: failed to get context: %s", err)
			http.NotFound(w, r)
			return
		}

		clusterURL, err := url.Parse(kContext.Cluster.Server)
		if err != nil {
			log.Printf("Error: failed to parse cluster URL: %s", err)
			http.NotFound(w, r)
		}

		r.Host = clusterURL.Host
		r.Header.Set("X-Forwarded-Host", r.Header.Get("Host"))
		r.URL.Host = clusterURL.Host
		r.URL.Path = mux.Vars(r)["api"]
		r.URL.Scheme = clusterURL.Scheme

		plugins.HandlePluginReload(c.cache, w)

		err = kContext.ProxyRequest(w, r)
		if err != nil {
			log.Printf("Error: failed to proxy request: %s", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	})
}

func (c *HeadlampConfig) handleClusterRequests(router *mux.Router) {
	if c.enableHelm {
		handleClusterHelm(c, router)
	}

	handleClusterAPI(c, router)
}

// Handles stateless cluster requests if kubeconfig is set and dynamic clusters are enabled.
// It returns context key which is used to store the context in the cache.
func (c *HeadlampConfig) handleStatelessReq(r *http.Request, kubeConfig string) (string, error) {
	var key string

	var contextKey string

	userID := r.Header.Get("X-HEADLAMP-USER-ID")
	clusterName := mux.Vars(r)["clusterName"]
	// unique key for the context
	key = clusterName + userID

	contexts, err := kubeconfig.LoadContextsFromBase64String(kubeConfig, kubeconfig.DynamicCluster)
	if err != nil {
		log.Println("Error setting up contexts from kubeconfig", err)
		return "", err
	}

	if len(contexts) == 0 {
		log.Println("Error getting contexts from kubeconfig")
		return "", err
	}

	for _, context := range contexts {
		context := context

		if context.Name == clusterName { //nolint:nestif
			// check context is present
			_, err := c.kubeConfigStore.GetContext(key)
			if err != nil {
				if err.Error() == "key not found" {
					if err = c.kubeConfigStore.AddContextWithKeyAndTTL(&context, key, ContextCacheTTL); err != nil {
						log.Println("Error: failed to store proxy: ", err)
						return "", err
					}
				}
			} else {
				if err = c.kubeConfigStore.UpdateTTL(key, ContextUpdateChacheTTL); err != nil {
					log.Println("Error: failed to increase ttl: ", err)
					return "", err
				}
			}

			contextKey = key
		} else {
			contextKey = clusterName
		}
	}

	return contextKey, nil
}

func (c *HeadlampConfig) getClusters() []Cluster {
	clusters := []Cluster{}

	contexts, err := c.kubeConfigStore.GetContexts()
	if err != nil {
		log.Printf("Error: failed to get contexts: %s", err)
		return clusters
	}

	for _, context := range contexts {
		context := context

		clusters = append(clusters, Cluster{
			Name:     context.Name,
			Server:   context.Cluster.Server,
			AuthType: context.AuthType(),
			Metadata: map[string]interface{}{
				"source": context.SourceStr(),
			},
		})
	}

	return clusters
}

// parseClusterFromKubeConfig parses the kubeconfig and returns a list of contexts and errors.
func (c *HeadlampConfig) parseClusterFromKubeConfig(kubeConfigs []string) ([]Cluster, []error) {
	clusters := []Cluster{}

	var setupErrors []error

	for _, kubeConfig := range kubeConfigs {
		var contexts []kubeconfig.Context

		kubeConfigByte, err := base64.StdEncoding.DecodeString(kubeConfig)
		if err != nil {
			log.Printf("Error: decoding kubeconfig: %s", err)
			setupErrors = append(setupErrors, err)

			continue
		}

		config, err := clientcmd.Load(kubeConfigByte)
		if err != nil {
			log.Printf("Error: loading kubeconfig: %s", err)
			setupErrors = append(setupErrors, err)

			continue
		}

		contexts, errs := kubeconfig.LoadContextsFromAPIConfig(config, true)
		if len(errs) > 0 {
			setupErrors = append(setupErrors, errs...)
			continue
		}

		for _, context := range contexts {
			context := context
			clusters = append(clusters, Cluster{
				Name:     context.Name,
				Server:   context.Cluster.Server,
				AuthType: context.AuthType(),
				Metadata: map[string]interface{}{
					"source": "dynamic_cluster",
				},
			})
		}
	}

	if len(setupErrors) > 0 {
		log.Println("Error setting up contexts from kubeconfig", setupErrors)
		return nil, setupErrors
	}

	return clusters, nil
}

func (c *HeadlampConfig) getConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	clientConfig := clientConfig{c.getClusters()}

	if err := json.NewEncoder(w).Encode(&clientConfig); err != nil {
		log.Println("Error encoding config", err)
	}
}

// parseKubeConfig parses the kubeconfig and returns a list of contexts and errors.
func (c *HeadlampConfig) parseKubeConfig(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Create a variable to store the decoded JSON data
	var kubeconfigReq KubeconfigRequest

	// Decode the JSON request body into the kubeconfigReq variable
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&kubeconfigReq); err != nil {
		// Handle the error, return a bad request response
		log.Println("Error decoding config", err)
		http.Error(w, "Invalid JSON request body", http.StatusBadRequest)
	}

	kubeconfigs := kubeconfigReq.Kubeconfigs

	contexts, setupErrors := c.parseClusterFromKubeConfig(kubeconfigs)
	if len(setupErrors) > 0 {
		log.Println("Error setting up contexts from kubeconfig", setupErrors)
		http.Error(w, "Error setting up contexts from kubeconfig", http.StatusBadRequest)

		return
	}

	clientConfig := clientConfig{contexts}

	if err := json.NewEncoder(w).Encode(&clientConfig); err != nil {
		log.Println("Error encoding config", err)
		http.Error(w, "Invalid JSON request body", http.StatusBadRequest)
	}
}

//nolint:funlen,nestif
func (c *HeadlampConfig) addCluster(w http.ResponseWriter, r *http.Request) {
	if err := checkHeadlampBackendToken(w, r); err != nil {
		return
	}

	clusterReq := ClusterReq{}
	if err := json.NewDecoder(r.Body).Decode(&clusterReq); err != nil {
		http.Error(w, "Error decoding cluster info", http.StatusBadRequest)
		return
	}

	if (clusterReq.KubeConfig == nil) && (clusterReq.Name == nil || clusterReq.Server == nil) {
		http.Error(w, "Error creating cluster with invalid info; please provide a 'name' and 'server' fields at least.",
			http.StatusBadRequest)

		return
	}

	var contexts []kubeconfig.Context

	var setupErrors []error

	if clusterReq.KubeConfig != nil {
		kubeConfigByte, err := base64.StdEncoding.DecodeString(*clusterReq.KubeConfig)
		if err != nil {
			http.Error(w, "Error decoding kubeconfig", http.StatusBadRequest)
			return
		}

		config, err := clientcmd.Load(kubeConfigByte)
		if err != nil {
			http.Error(w, "Error loading kubeconfig", http.StatusBadRequest)
			return
		}

		kubeConfigPersistenceDir, err := defaultKubeConfigPersistenceDir()
		if err != nil {
			http.Error(w, "Error getting default kubeconfig persistence dir", http.StatusInternalServerError)
		}

		err = kubeconfig.WriteToFile(*config, kubeConfigPersistenceDir)
		if err != nil {
			http.Error(w, "Error writing kubeconfig", http.StatusBadRequest)
			return
		}

		contexts, setupErrors = kubeconfig.LoadContextsFromAPIConfig(config, false)
	} else {
		conf := &api.Config{
			Clusters: map[string]*api.Cluster{
				*clusterReq.Name: {
					Server:                   *clusterReq.Server,
					InsecureSkipTLSVerify:    clusterReq.InsecureSkipTLSVerify,
					CertificateAuthorityData: clusterReq.CertificateAuthorityData,
				},
			},
			Contexts: map[string]*api.Context{
				*clusterReq.Name: {
					Cluster: *clusterReq.Name,
				},
			},
		}

		contexts, setupErrors = kubeconfig.LoadContextsFromAPIConfig(conf, false)
	}

	if len(contexts) == 0 {
		http.Error(w, "Error getting contexts from kubeconfig", http.StatusBadRequest)
		return
	}

	for _, context := range contexts {
		context := context
		context.Source = kubeconfig.DynamicCluster

		err := c.kubeConfigStore.AddContext(&context)
		if err != nil {
			setupErrors = append(setupErrors, err)
		}
	}

	if len(setupErrors) > 0 {
		log.Println("Error setting up contexts from kubeconfig", setupErrors)
		http.Error(w, "Error setting up contexts from kubeconfig", http.StatusBadRequest)

		return
	}

	w.WriteHeader(http.StatusCreated)
	c.getConfig(w, r)
}

func (c *HeadlampConfig) deleteCluster(w http.ResponseWriter, r *http.Request) {
	if err := checkHeadlampBackendToken(w, r); err != nil {
		return
	}

	name := mux.Vars(r)["name"]

	err := c.kubeConfigStore.RemoveContext(name)
	if err != nil {
		log.Printf("Error deleting cluster %s: %s", name, err)
		http.Error(w, "Error deleting cluster", http.StatusInternalServerError)
	}

	kubeConfigPersistenceFile, err := defaultKubeConfigPersistenceFile()
	if err != nil {
		http.Error(w, "Error getting default kubeconfig persistence file", http.StatusInternalServerError)
		return
	}

	log.Println("Removing cluster from kubeconfig", name, kubeConfigPersistenceFile)

	err = kubeconfig.RemoveContextFromFile(name, kubeConfigPersistenceFile)
	if err != nil {
		log.Printf("Error removing cluster from kubeconfig: %v\n", err)
		http.Error(w, "Error removing cluster from kubeconfig", http.StatusInternalServerError)

		return
	}

	log.Printf("Removed cluster \"%s\" proxy\n", name)

	c.getConfig(w, r)
}

func (c *HeadlampConfig) addClusterSetupRoute(r *mux.Router) {
	// Do not add the route if dynamic clusters are disabled
	if !c.enableDynamicClusters {
		return
	}
	// Get stateless cluster
	r.HandleFunc("/parseKubeConfig", c.parseKubeConfig).Methods("POST")

	// POST a cluster
	r.HandleFunc("/cluster", c.addCluster).Methods("POST")

	// Delete a cluster
	r.HandleFunc("/cluster/{name}", c.deleteCluster).Methods("DELETE")
}

/*
This function is used to handle the node drain request.
*/
func (c *HeadlampConfig) handleNodeDrain(w http.ResponseWriter, r *http.Request) {
	var drainPayload struct {
		Cluster  string `json:"cluster"`
		NodeName string `json:"nodeName"`
	}
	// get nodeName and cluster from request body
	err := json.NewDecoder(r.Body).Decode(&drainPayload)
	if err != nil {
		http.Error(w, "Error decoding payload", http.StatusBadRequest)
		return
	}

	if drainPayload.NodeName == "" {
		http.Error(w, "nodeName is required", http.StatusBadRequest)
		return
	}

	if drainPayload.Cluster == "" {
		http.Error(w, "clusterName is required", http.StatusBadRequest)
		return
	}
	// get token from header
	token := r.Header.Get("Authorization")

	ctxtProxy, err := c.kubeConfigStore.GetContext(drainPayload.Cluster)
	if err != nil {
		http.Error(w, "Cluster not found", http.StatusNotFound)
	}

	clientset, err := ctxtProxy.ClientSetWithToken(token)
	if err != nil {
		http.Error(w, "Error getting client", http.StatusInternalServerError)
		return
	}

	var responsePayload struct {
		Message string `json:"message"`
		Cluster string `json:"cluster"`
	}

	responsePayload.Cluster = drainPayload.Cluster
	responsePayload.Message = "Drain node request submitted successfully"

	if err = json.NewEncoder(w).Encode(responsePayload); err != nil {
		http.Error(w, "Error writing response", http.StatusInternalServerError)
		return
	}

	c.drainNode(clientset, drainPayload.NodeName, drainPayload.Cluster)
}

func (c *HeadlampConfig) drainNode(clientset *kubernetes.Clientset, nodeName string, cluster string) {
	go func() {
		nodeClient := clientset.CoreV1().Nodes()
		ctx := context.Background()
		cacheKey := uuid.NewSHA1(uuid.Nil, []byte(nodeName+cluster)).String()
		cacheItemTTL := DrainNodeCacheTTL * time.Minute

		node, err := nodeClient.Get(context.TODO(), nodeName, v1.GetOptions{})
		if err != nil {
			_ = c.cache.SetWithTTL(ctx, cacheKey, "error: "+err.Error(), cacheItemTTL)
			return
		}

		// cordon the node first
		node.Spec.Unschedulable = true
		_, err = nodeClient.Update(context.TODO(), node, v1.UpdateOptions{})

		if err != nil {
			_ = c.cache.SetWithTTL(ctx, cacheKey, "error: "+err.Error(), cacheItemTTL)
			return
		}

		pods, err := clientset.CoreV1().Pods("").List(context.TODO(),
			v1.ListOptions{FieldSelector: "spec.nodeName=" + nodeName})
		if err != nil {
			_ = c.cache.SetWithTTL(ctx, cacheKey, "error: "+err.Error(), cacheItemTTL)
			return
		}

		var gracePeriod int64 = 0

		for _, pod := range pods.Items {
			// ignore daemonsets
			if pod.ObjectMeta.Labels["kubernetes.io/created-by"] == "daemonset-controller" {
				continue
			}

			_ = clientset.CoreV1().Pods(pod.Namespace).Delete(context.TODO(),
				pod.Name, v1.DeleteOptions{GracePeriodSeconds: &gracePeriod})
		}

		_ = c.cache.SetWithTTL(ctx, cacheKey, "success", cacheItemTTL)
	}()
}

/*
* Handle node drain status
Since node drain is an async operation, we need to poll for the status of the drain operation
This endpoint returns the status of the drain operation.
*/
func (c *HeadlampConfig) handleNodeDrainStatus(w http.ResponseWriter, r *http.Request) {
	var drainPayload struct {
		Cluster  string `json:"cluster"`
		NodeName string `json:"nodeName"`
	}

	drainPayload.Cluster = r.URL.Query().Get("cluster")
	drainPayload.NodeName = r.URL.Query().Get("nodeName")

	if drainPayload.NodeName == "" {
		http.Error(w, "nodeName is required", http.StatusBadRequest)
		return
	}

	if drainPayload.Cluster == "" {
		http.Error(w, "clusterName is required", http.StatusBadRequest)
		return
	}

	cacheKey := uuid.NewSHA1(uuid.Nil, []byte(drainPayload.NodeName+drainPayload.Cluster)).String()
	ctx := context.Background()

	cacheItem, err := c.cache.Get(ctx, cacheKey)
	if err != nil {
		w.WriteHeader(http.StatusNotFound)
		return
	}

	var responsePayload struct {
		ID      string `json:"id"`
		Cluster string `json:"cluster"`
	}

	responsePayload.ID = cacheItem.(string)
	responsePayload.Cluster = drainPayload.Cluster

	if err = json.NewEncoder(w).Encode(responsePayload); err != nil {
		http.Error(w, "Error writing response", http.StatusInternalServerError)
		return
	}
}

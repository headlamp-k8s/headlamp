package main

import (
	"encoding/json"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
)

func main() {
	conf, err := config.Parse(os.Args)
	if err != nil {
		log.Fatalf("Error fetching config:%v", err)
	}

	// kubeconfig store
	kubeConfigStore := kubeconfig.NewContextStore()

	// load kubeconfig files
	err = kubeconfig.LoadAndStoreKubeConfigs(kubeConfigStore, conf.KubeConfigPath)
	if err != nil {
		log.Fatalf("Error loading kubeconfig file:%v", err)
	}

	contexts, err := kubeConfigStore.GetContexts()
	if err != nil {
		log.Fatalf("Error getting contexts:%v", err)
	}

	router := mux.NewRouter()
	// On dev mode we're loose about where connections come from
	headers := handlers.AllowedHeaders([]string{"X-Requested-With", "Content-Type", "Authorization", "Forward-To"})
	methods := handlers.AllowedMethods([]string{"GET", "POST", "PUT", "HEAD", "DELETE", "PATCH", "OPTIONS"})
	origins := handlers.AllowedOrigins([]string{"*"})

	handler := handlers.CORS(headers, methods, origins)(router)

	// add routes

	type clientConfig struct {
		Clusters []Cluster `json:"clusters"`
	}
	// add /config route
	router.HandleFunc("/config", func(w http.ResponseWriter, r *http.Request) {

		var clusters []Cluster

		for _, context := range contexts {
			ctx := context
			cluster := Cluster{
				Name:     ctx.Name,
				AuthType: "",
			}
			clusters = append(clusters, cluster)
		}

		clientConfig := clientConfig{clusters}

		if err := json.NewEncoder(w).Encode(&clientConfig); err != nil {
			log.Println("Error encoding config", err)
		}

	}).Methods("GET")

	// add /clusters/{} route
	router.PathPrefix("/clusters/{clusterName}/{api:.*}").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		clusterName := mux.Vars(r)["clusterName"]

		// get the context
		context, err := kubeConfigStore.GetContext(clusterName)
		if err != nil {
			log.Println("Error getting context", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		err = context.ProxyRequest(&w, r)
		if err != nil {
			log.Println("Error proxying request", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

	})

	// run server

	http.ListenAndServe(":4466", handler)
	// StartHeadlampServer(&HeadlampConfig{
	// 	useInCluster:          conf.InCluster,
	// 	kubeConfigPath:        conf.KubeConfigPath,
	// 	port:                  conf.Port,
	// 	devMode:               conf.DevMode,
	// 	staticDir:             conf.StaticDir,
	// 	insecure:              conf.InsecureSsl,
	// 	pluginDir:             conf.PluginsDir,
	// 	oidcClientID:          conf.OidcClientID,
	// 	oidcClientSecret:      conf.OidcClientSecret,
	// 	oidcIdpIssuerURL:      conf.OidcIdpIssuerURL,
	// 	oidcScopes:            strings.Split(conf.OidcScopes, ","),
	// 	baseURL:               conf.BaseURL,
	// 	proxyURLs:             strings.Split(conf.ProxyURLs, ","),
	// 	enableHelm:            conf.EnableHelm,
	// 	enableDynamicClusters: conf.EnableDynamicClusters,
	// 	cache:                 cache,
	// })
}

package main

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"

	"github.com/gorilla/mux"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
)

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

		if context.Name != clusterName {
			contextKey = clusterName
			continue
		}

		// check context is present
		_, err := c.kubeConfigStore.GetContext(key)
		if err != nil && err.Error() == "key not found" {
			// To ensure stateless clusters are not visible to other users, they are marked as internal clusters.
			// They are stored in the proxy cache and accessed through the /config endpoint.
			context.Internal = true
			if err = c.kubeConfigStore.AddContextWithKeyAndTTL(&context, key, ContextCacheTTL); err != nil {
				log.Println("Error: failed to store context to cache:", err)
				return "", err
			}
		} else {
			if err = c.kubeConfigStore.UpdateTTL(key, ContextUpdateChacheTTL); err != nil {
				log.Println("Error: failed to increase ttl: ", err)
				return "", err
			}
		}

		contextKey = key
	}

	return contextKey, nil
}

// parseKubeConfig parses the kubeconfig and returns a list of contexts and errors.
// Input is a list of base64 encoded kubeconfigs. Output is a list of clusters.
// Input: {"kubeconfigs": ["base64 encoded kubeconfig 1", "base64 encoded kubeconfig 2"]}
// Output: {"clusters": [{"name": "cluster 1", "server": "https://cluster1.server.com",
// "authType": "token"}, {"name": "cluster 2", "server": "https://cluster2.server.com", "authType": "token"}]}.
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

	contexts, setupErrors := parseClusterFromKubeConfig(kubeconfigs)
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

// websocketConnContextKey handles websocket requests. It returns context key
// which is used to store the context in the cache. The context key is
// unique for each user. It is found in the "X-HEADLAMP-USER-ID" parameter
// in the websocket URL.
func websocketConnContextKey(w http.ResponseWriter, r *http.Request, clusterName string) (string, error) {
	var contextKey string
	// Parse the URL
	u, err := url.Parse(r.URL.String())
	if err != nil {
		log.Println("Error: parsing URL: ", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)

		return "", err
	}

	// Get the query parameters
	queryParams := u.Query()
	// Check if "X-HEADLAMP-USER-ID" parameter is present in the websocket URL.
	userIDparam := queryParams.Get("X-HEADLAMP-USER-ID")
	if userIDparam != "" {
		contextKey = clusterName + userIDparam
	} else {
		contextKey = clusterName
	}

	// Remove the "X-HEADLAMP-USER-ID" parameter from the websocket URL.
	delete(queryParams, "X-HEADLAMP-USER-ID")
	u.RawQuery = queryParams.Encode()
	r.URL = u

	return contextKey, nil
}

// getContextKeyForRequest handles every requests. It returns context key
// which is used to store the context in the cache. The context key is
// unique for each user. It is found in the "X-HEADLAMP-USER-ID" parameter.
// For stateless clusters it is combination of cluster name and user id.
// For normal clusters it is just the cluster name.
func (c *HeadlampConfig) getContextKeyForRequest(w http.ResponseWriter, r *http.Request) (string, error) {
	var contextKey string

	var err error

	clusterName := mux.Vars(r)["clusterName"]

	// checking if kubeConfig exists, if not check if the request headers for kubeConfig information
	kubeConfig := r.Header.Get("KUBECONFIG")

	if kubeConfig != "" && c.enableDynamicClusters {
		// if kubeConfig is set and dynamic clusters are enabled then handle stateless cluster requests
		key, err := c.handleStatelessReq(r, kubeConfig)
		if err != nil {
			return "", err
		}

		contextKey = key
	} else {
		contextKey = clusterName
	}

	// This means the connection is from websocket so there won't be kubeconfig header.
	// We get the value of X-HEADLAMP-USER-ID from the parameter and append it to the cluster name
	// to get the context key. This is to ensure that the context key is unique for each user.
	if r.Header.Get("Upgrade") == "websocket" {
		contextKey, err = websocketConnContextKey(w, r, clusterName)
		if err != nil {
			return "", err
		}
	}

	return contextKey, nil
}

package main

import (
	"encoding/json"
	"log"
	"net/http"

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

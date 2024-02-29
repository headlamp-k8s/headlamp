package main

import (
	"encoding/json"
	"net/http"
	"regexp"
	"strings"

	"github.com/gorilla/mux"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/headlamp-k8s/headlamp/backend/pkg/logger"
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
		logger.Log(logger.LevelError, nil, err, "loading contexts from kubeconfig")

		return "", err
	}

	if len(contexts) == 0 {
		logger.Log(logger.LevelError, nil, nil, "getting contexts from kubeconfig")

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
				logger.Log(logger.LevelError, map[string]string{"key": key},
					err, "adding context to cache")

				return "", err
			}
		} else {
			if err = c.kubeConfigStore.UpdateTTL(key, ContextUpdateChacheTTL); err != nil {
				logger.Log(logger.LevelError, map[string]string{"key": key},
					err, "updating context ttl")

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
		logger.Log(logger.LevelError, nil, err, "decoding config")

		http.Error(w, "Invalid JSON request body", http.StatusBadRequest)
	}

	kubeconfigs := kubeconfigReq.Kubeconfigs

	contexts, setupErrors := parseClusterFromKubeConfig(kubeconfigs)
	if len(setupErrors) > 0 {
		logger.Log(logger.LevelError, nil, setupErrors, "setting up contexts from kubeconfig")

		http.Error(w, "setting up contexts from kubeconfig", http.StatusBadRequest)

		return
	}

	clientConfig := clientConfig{contexts, c.enableDynamicClusters}

	if err := json.NewEncoder(w).Encode(&clientConfig); err != nil {
		logger.Log(logger.LevelError, nil, err, "encoding config")

		http.Error(w, "Invalid JSON request body", http.StatusBadRequest)
	}
}

// websocketConnContextKey handles websocket requests. It returns context key
// which is used to store the context in the cache. The context key is
// unique for each user. It is found in the "base64url.headlamp.authorization.k8s.io" protocol
// of the websocket.
func websocketConnContextKey(r *http.Request, clusterName string) string {
	// Expected number of submatches in the regular expression
	const expectedSubmatches = 2

	var contextKey string
	// Define a regular expression pattern for base64url.headlamp.authorization.k8s.io
	pattern := `base64url\.headlamp\.authorization\.k8s\.io\.([a-zA-Z0-9_-]+)`

	// Compile the regular expression
	re := regexp.MustCompile(pattern)

	// Find the match in the header value
	matches := re.FindStringSubmatch(r.Header.Get("Sec-Websocket-Protocol"))

	// Check if a match is found
	if len(matches) >= expectedSubmatches {
		// Extract the value after the specified prefix
		contextKey = clusterName + matches[1]
	} else {
		contextKey = clusterName
	}

	// Remove the base64url.headlamp.authorization.k8s.io subprotocol from the list
	// because it is unrecognized by the k8s server.
	protocols := strings.Split(r.Header.Get("Sec-Websocket-Protocol"), ", ")

	var updatedProtocols []string

	for _, protocol := range protocols {
		if !strings.HasPrefix(protocol, "base64url.headlamp.authorization.k8s.io.") {
			updatedProtocols = append(updatedProtocols, protocol)
		}
	}

	updatedProtocol := strings.Join(updatedProtocols, ", ")

	// Remove the existing Sec-Websocket-Protocol header
	r.Header.Del("Sec-Websocket-Protocol")

	// Add the updated Sec-Websocket-Protocol header
	r.Header.Add("Sec-Websocket-Protocol", updatedProtocol)

	return contextKey
}

// getContextKeyForRequest handles every requests. It returns context key
// which is used to store the context in the cache. The context key is
// unique for each user. It is found in the "X-HEADLAMP-USER-ID" parameter.
// For stateless clusters it is combination of cluster name and user id.
// For normal clusters it is just the cluster name.
func (c *HeadlampConfig) getContextKeyForRequest(r *http.Request) (string, error) {
	var contextKey string

	clusterName := mux.Vars(r)["clusterName"]

	// checking if kubeConfig exists, if not check if the request headers for kubeConfig information
	kubeConfig := r.Header.Get("KUBECONFIG")

	if kubeConfig != "" && c.enableDynamicClusters {
		// if kubeConfig is set and dynamic clusters are enabled then handle stateless cluster requests
		key, err := c.handleStatelessReq(r, kubeConfig)
		if err != nil {
			logger.Log(logger.LevelError, nil, err, "handling stateless request")

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
		contextKey = websocketConnContextKey(r, clusterName)
	}

	return contextKey, nil
}

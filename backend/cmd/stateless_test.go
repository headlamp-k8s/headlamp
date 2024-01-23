package main

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/google/uuid"
	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

//nolint:funlen
func TestStatelessClustersKubeConfig(t *testing.T) {
	kubeConfigByte, err := os.ReadFile("./headlamp_testdata/kubeconfig")
	require.NoError(t, err)

	kubeConfig := base64.StdEncoding.EncodeToString(kubeConfigByte)

	tests := []struct {
		name                string
		clusters            []KubeconfigRequest
		expectedState       int
		expectedNumClusters int
	}{
		{
			name: "valid",
			clusters: []KubeconfigRequest{
				{
					Kubeconfigs: []string{kubeConfig},
				},
			},
			expectedState:       http.StatusOK,
			expectedNumClusters: 2,
		},
		{
			name: "invalid",
			clusters: []KubeconfigRequest{
				{
					Kubeconfigs: []string{"badKubeconfig"},
				},
			},
			expectedState:       http.StatusBadRequest,
			expectedNumClusters: 0,
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			cache := cache.New[interface{}]()
			kubeConfigStore := kubeconfig.NewContextStore()
			c := HeadlampConfig{
				useInCluster:          false,
				kubeConfigPath:        "",
				enableDynamicClusters: true,
				cache:                 cache,
				kubeConfigStore:       kubeConfigStore,
			}
			handler := createHeadlampHandler(&c)

			for _, clusterReq := range tc.clusters {
				r, err := getResponseFromRestrictedEndpoint(handler, "POST", "/parseKubeConfig", clusterReq)
				if err != nil {
					t.Fatal(err)
				}

				assert.Equal(t, r.Code, tc.expectedState)

				// Verify if the created cluster matches what we asked to be created
				if r.Code == http.StatusOK {
					var config clientConfig

					err = json.Unmarshal(r.Body.Bytes(), &config)
					if err != nil {
						t.Fatal(err)
					}

					assert.Equal(t, tc.expectedNumClusters, len(config.Clusters))
				}
			}
		})
	}
}

//nolint:funlen
func TestStatelessClusterApiRequest(t *testing.T) {
	kubeConfigByte, err := os.ReadFile("./headlamp_testdata/kubeconfig")
	require.NoError(t, err)

	kubeConfig := base64.StdEncoding.EncodeToString(kubeConfigByte)

	tests := []struct {
		name   string
		userID string
	}{
		{
			name:   "minikube",
			userID: uuid.New().String(),
		},
	}

	for _, tc := range tests {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			cache := cache.New[interface{}]()
			kubeConfigStore := kubeconfig.NewContextStore()
			c := HeadlampConfig{
				useInCluster:          false,
				kubeConfigPath:        "",
				enableDynamicClusters: true,
				cache:                 cache,
				kubeConfigStore:       kubeConfigStore,
			}
			handler := createHeadlampHandler(&c)

			headers := map[string]string{
				"KUBECONFIG":         kubeConfig,
				"X-HEADLAMP-USER-ID": tc.userID,
			}

			requestPath := fmt.Sprintf("/clusters/%s/version/", tc.name)
			req, err := http.NewRequest("GET", requestPath, nil) //nolint:noctx
			require.NoError(t, err)

			// Add headers to the request
			for key, value := range headers {
				req.Header.Add(key, value)
			}

			// Perform the request
			resp := httptest.NewRecorder()
			handler.ServeHTTP(resp, req)

			configuredClusters := c.getClusters()

			var cluster *Cluster

			// Get cluster we created
			for i, val := range configuredClusters {
				if val.Name == tc.name {
					cluster = &configuredClusters[i]
					break
				}
			}

			// Assert the response as needed
			assert.NotNil(t, cluster)
			assert.Equal(t, tc.name, cluster.Name)
		})
	}
}

package main

import (
	"bytes"
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"strings"
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

const (
	staticTestPath = "headlamp_testdata/static_files/"
	minikubeName   = "minikube"
)

// Is supposed to return the index.html if there is no static file.
func TestSpaHandlerMissing(t *testing.T) {
	req, err := http.NewRequest("GET", "/headlampxxx", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := spaHandler{staticPath: staticTestPath, indexPath: "index.html", baseURL: "/headlamp"}
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	indexExpected := "The index."

	if !strings.HasPrefix(rr.Body.String(), indexExpected) {
		t.Errorf("handler returned unexpected body: got :%v: want :%v:",
			rr.Body.String(), indexExpected)
	}
}

// Works with a baseURL to get the index.html.
func TestSpaHandlerBaseURL(t *testing.T) {
	req, err := http.NewRequest("GET", "/headlamp/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := spaHandler{staticPath: staticTestPath, indexPath: "index.html", baseURL: "/headlamp"}
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	indexExpected := "The index."
	if !strings.HasPrefix(rr.Body.String(), indexExpected) {
		t.Errorf("handler returned unexpected body: got :%v: want :%v:",
			rr.Body.String(), indexExpected)
	}
}

// Works with a baseURL to get other files.
func TestSpaHandlerOtherFiles(t *testing.T) {
	req, err := http.NewRequest("GET", "/headlamp/example.css", nil) //nolint:noctx
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := spaHandler{staticPath: staticTestPath, indexPath: "index.html", baseURL: "/headlamp"}
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expectedCSS := ".somecss"
	if !strings.HasPrefix(rr.Body.String(), expectedCSS) {
		t.Errorf("handler returned unexpected body: got :%v: want :%v:",
			rr.Body.String(), expectedCSS)
	}
}

func makeJSONReq(method, url string, jsonObj interface{}) (*http.Request, error) {
	var jsonBytes []byte = nil

	if jsonObj != nil {
		b, err := json.Marshal(jsonObj)
		if err != nil {
			return nil, err
		}

		jsonBytes = b
	}

	return http.NewRequestWithContext(context.Background(), method, url, bytes.NewBuffer(jsonBytes))
}

func getResponse(handler http.Handler, method, url string, body interface{}) (*httptest.ResponseRecorder, error) {
	req, err := makeJSONReq(method, url, body)
	if err != nil {
		return nil, err
	}

	rr := httptest.NewRecorder()
	handler.ServeHTTP(rr, req)

	return rr, nil
}

func getResponseFromRestrictedEndpoint(handler http.Handler, method, url string, body interface{}) (*httptest.ResponseRecorder, error) { //nolint:lll
	token := uuid.New().String()
	os.Setenv("HEADLAMP_BACKEND_TOKEN", token)

	defer os.Unsetenv("HEADLAMP_BACKEND_TOKEN")

	req, err := makeJSONReq(method, url, body)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-HEADLAMP_BACKEND-TOKEN", token)

	rr := httptest.NewRecorder()

	handler.ServeHTTP(rr, req)

	return rr, nil
}

//nolint:gocognit,funlen
func TestDynamicClusters(t *testing.T) {
	if os.Getenv("HEADLAMP_RUN_INTEGRATION_TESTS") != "true" {
		t.Skip("skipping integration test")
	}

	var (
		newCluster        = "mynewcluster"
		newClusterServer  = "https://mysupercluster.io"
		newCluster2       = "mynewcluster-2"
		newCluster2Server = "https://mysupercluster2.io"
		newCluster3       = "mynewcluster-3"
		newCluster3Server = "https://mysupercluster3.io"
	)

	tests := []struct {
		name                string
		clusters            []ClusterReq
		expectedState       int
		expectedNumClusters int
	}{
		{
			name: "create",
			clusters: []ClusterReq{
				{
					Name:                     &newCluster,
					Server:                   &newClusterServer,
					CertificateAuthorityData: []byte("abcde"),
				},
				{
					Name:                     &newCluster2,
					Server:                   &newCluster2Server,
					InsecureSkipTLSVerify:    true,
					CertificateAuthorityData: []byte("abcde"),
				},
				{
					Name:                     &newCluster3,
					Server:                   &newCluster3Server,
					CertificateAuthorityData: []byte("abcde"),
				},
			},
			expectedState:       http.StatusCreated,
			expectedNumClusters: 3,
		},
		{
			name: "override",
			clusters: []ClusterReq{
				{
					Name:                     &newCluster,
					Server:                   &newClusterServer,
					CertificateAuthorityData: []byte("abcde"),
				},
				{
					Name:                     &newCluster, // same name will override
					Server:                   &newCluster2Server,
					CertificateAuthorityData: []byte("abcde"),
				},
			},
			expectedState:       http.StatusCreated,
			expectedNumClusters: 1,
		},
		{
			name: "invalid",
			clusters: []ClusterReq{
				{
					Name:                     nil,
					Server:                   &newClusterServer,
					CertificateAuthorityData: []byte("abcde"),
				},
				{
					Name:                     &newCluster,
					Server:                   nil,
					CertificateAuthorityData: []byte("abcde"),
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

			var resp *httptest.ResponseRecorder
			for _, clusterReq := range tc.clusters {
				r, err := getResponseFromRestrictedEndpoint(handler, "POST", "/cluster", clusterReq)
				if err != nil {
					t.Fatal(err)
				}

				assert.Equal(t, r.Code, tc.expectedState)

				// Verify if the created cluster matches what we asked to be created
				if r.Code == http.StatusCreated {
					var config clientConfig

					err = json.Unmarshal(r.Body.Bytes(), &config)
					if err != nil {
						t.Fatal(err)
					}

					configuredClusters := c.getClusters()
					var cluster *Cluster

					// Get cluster we created
					for i, val := range configuredClusters {
						if val.Name == *clusterReq.Name {
							cluster = &configuredClusters[i]
							break
						}
					}

					assert.NotNil(t, cluster)
					assert.Equal(t, *clusterReq.Name, cluster.Name)
					assert.Equal(t, *clusterReq.Server, cluster.Server)
				}

				resp = r
			}

			// The response for the /config should be the same as the previous /cluster call.
			configResp, err := getResponse(handler, "GET", "/config", nil)
			if err != nil {
				t.Fatal(err)
			}

			if resp.Code == http.StatusCreated {
				var clusterConfig clientConfig
				err = json.Unmarshal(resp.Body.Bytes(), &clusterConfig)
				if err != nil {
					t.Fatal(err)
				}
				var config clientConfig
				err = json.Unmarshal(configResp.Body.Bytes(), &config)
				if err != nil {
					t.Fatal(err)
				}

				assert.Equal(t, len(clusterConfig.Clusters), len(config.Clusters))
				assert.Equal(t, tc.expectedNumClusters, len(c.getClusters()))
			}
		})
	}
}

func TestDynamicClustersKubeConfig(t *testing.T) {
	kubeConfigByte, err := os.ReadFile("./headlamp_testdata/kubeconfig")
	require.NoError(t, err)

	kubeConfig := base64.StdEncoding.EncodeToString(kubeConfigByte)
	req := ClusterReq{
		KubeConfig: &kubeConfig,
	}
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

	r, err := getResponseFromRestrictedEndpoint(handler, "POST", "/cluster", req)
	if err != nil {
		t.Fatal(err)
	}

	clusters := c.getClusters()

	assert.Equal(t, http.StatusCreated, r.Code)
	assert.Equal(t, 2, len(clusters))

	var contextWithoutNamespace *Cluster

	var minikubeCluster *Cluster

	for i, cluster := range clusters {
		if cluster.Name == minikubeName {
			// Using the slice addressing here to avoid the
			// implicit memory aliasing in the loop.
			minikubeCluster = &clusters[i]
		} else if cluster.Name == "docker-desktop" {
			contextWithoutNamespace = &clusters[i]
		}
	}

	assert.NotNil(t, contextWithoutNamespace)
	assert.Equal(t, "", contextWithoutNamespace.Metadata["namespace"])

	assert.NotNil(t, minikubeCluster)
	assert.Equal(t, minikubeName, minikubeCluster.Name)
	assert.Equal(t, "default", minikubeCluster.Metadata["namespace"])
}

//nolint:funlen
func TestExternalProxy(t *testing.T) {
	// Create a new server for testing
	proxyServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("OK"))
		if err != nil {
			t.Fatal(err)
		}
	}))
	defer proxyServer.Close()

	type test struct {
		handler             http.Handler
		useForwardedHeaders bool
		useNoProxyURL       bool
		useProxyURL         bool
	}

	// get the proxyServer URL
	proxyURL, err := url.Parse(proxyServer.URL)
	if err != nil {
		t.Fatal(err)
	}

	cache := cache.New[interface{}]()
	kubeConfigStore := kubeconfig.NewContextStore()

	tests := []test{
		{
			handler: createHeadlampHandler(&HeadlampConfig{
				useInCluster:    false,
				proxyURLs:       []string{proxyURL.String()},
				cache:           cache,
				kubeConfigStore: kubeConfigStore,
			}),
			useForwardedHeaders: true,
		},
		{
			handler: createHeadlampHandler(&HeadlampConfig{
				useInCluster: false, proxyURLs: []string{},
				cache:           cache,
				kubeConfigStore: kubeConfigStore,
			}),
			useNoProxyURL: true,
		},
		{
			handler: createHeadlampHandler(&HeadlampConfig{
				useInCluster:    false,
				proxyURLs:       []string{proxyURL.String()},
				cache:           cache,
				kubeConfigStore: kubeConfigStore,
			}),
			useProxyURL: true,
		},
	}

	for _, tc := range tests {
		ctx := context.Background()

		req, err := http.NewRequestWithContext(ctx, "GET", "/externalproxy", nil)
		if err != nil {
			t.Fatal(err)
		}

		if tc.useForwardedHeaders {
			// Test with Forward-to header
			req.Header.Set("Forward-to", proxyURL.String())
		} else if tc.useProxyURL || tc.useNoProxyURL {
			// Test with proxy-to header
			req.Header.Set("proxy-to", proxyURL.String())
		}

		rr := httptest.NewRecorder()
		tc.handler.ServeHTTP(rr, req)

		if tc.useNoProxyURL {
			if status := rr.Code; status != http.StatusBadRequest {
				t.Errorf("handler returned wrong status code: got %v want %v",
					status, http.StatusBadRequest)
			}

			continue
		}

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, http.StatusOK)
		}

		if rr.Body.String() != "OK" {
			t.Errorf("handler returned unexpected body: got %v want %v",
				rr.Body.String(), "OK")
		}
	}
}

func TestDrainAndCordonNode(t *testing.T) {
	type test struct {
		handler http.Handler
	}

	cache := cache.New[interface{}]()
	kubeConfigStore := kubeconfig.NewContextStore()
	tests := []test{
		{
			handler: createHeadlampHandler(&HeadlampConfig{
				useInCluster:    false,
				kubeConfigPath:  config.GetDefaultKubeConfigPath(),
				cache:           cache,
				kubeConfigStore: kubeConfigStore,
			}),
		},
	}

	var drainNodePayload struct {
		Cluster  string `json:"cluster"`
		NodeName string `json:"nodeName"`
	}

	for _, tc := range tests {
		drainNodePayload.Cluster = minikubeName
		drainNodePayload.NodeName = minikubeName

		rr, err := getResponse(tc.handler, "POST", "/drain-node", drainNodePayload)
		if err != nil {
			t.Fatal(err)
		}

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, http.StatusOK)
		}

		cacheKey := uuid.NewSHA1(uuid.Nil, []byte(drainNodePayload.NodeName+drainNodePayload.Cluster)).String()
		cacheItemTTL := DrainNodeCacheTTL * time.Minute
		ctx := context.Background()

		err = cache.SetWithTTL(ctx, cacheKey, "success", cacheItemTTL)
		if err != nil {
			t.Fatal(err)
		}

		url := fmt.Sprintf(
			"/drain-node-status?cluster=%s&nodeName=%s",
			drainNodePayload.Cluster, drainNodePayload.NodeName,
		)

		rr, err = getResponse(tc.handler, "GET", url, nil)
		if err != nil {
			t.Fatal(err)
		}

		if status := rr.Code; status != http.StatusOK {
			t.Errorf("handler returned wrong status code: got %v want %v",
				status, http.StatusOK)
		}
	}
}

func TestDeletePlugin(t *testing.T) {
	// create temp dir for plugins
	tempDir, err := os.MkdirTemp("", "plugins")
	require.NoError(t, err)

	defer os.RemoveAll(tempDir)

	// create plugin
	pluginDir := tempDir + "/test-plugin"
	err = os.Mkdir(pluginDir, 0o755)
	require.NoError(t, err)

	// create plugin file
	pluginFile := pluginDir + "/main.js"
	_, err = os.Create(pluginFile)
	require.NoError(t, err)

	cache := cache.New[interface{}]()
	kubeConfigStore := kubeconfig.NewContextStore()

	c := HeadlampConfig{
		useInCluster:    false,
		kubeConfigPath:  config.GetDefaultKubeConfigPath(),
		cache:           cache,
		kubeConfigStore: kubeConfigStore,
		pluginDir:       tempDir,
	}

	handler := createHeadlampHandler(&c)

	rr, err := getResponseFromRestrictedEndpoint(handler, "DELETE", "/plugins/test-plugin", nil)
	require.NoError(t, err)

	assert.Equal(t, http.StatusOK, rr.Code)

	// check if plugin was deleted
	_, err = os.Stat(pluginDir)
	assert.True(t, os.IsNotExist(err))
}

package main

import (
	"bytes"
	"context"
	"crypto/tls"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"path/filepath"
	"strings"
	"testing"
	"time"

	"k8s.io/apimachinery/pkg/runtime"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"k8s.io/client-go/tools/clientcmd"
	"k8s.io/client-go/tools/clientcmd/api"
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

func TestInvalidKubeConfig(t *testing.T) {
	cache := cache.New[interface{}]()
	kubeConfigStore := kubeconfig.NewContextStore()

	absPath, err := filepath.Abs("./headlamp_testdata/kubeconfig_partialcontextvalid")
	assert.NoError(t, err)

	c := HeadlampConfig{
		useInCluster:          false,
		kubeConfigPath:        absPath,
		enableDynamicClusters: true,
		cache:                 cache,
		kubeConfigStore:       kubeConfigStore,
	}

	err = kubeconfig.LoadAndStoreKubeConfigs(kubeConfigStore, absPath, kubeconfig.KubeConfig)
	assert.Error(t, err)

	clusters := c.getClusters()

	assert.Equal(t, 1, len(clusters))
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

func TestHandleClusterAPI_XForwardedHost(t *testing.T) {
	// Create a new server for testing
	proxyServer := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Verify that X-Forwarded-Host is set to r.Host
		assert.Equal(t, r.Host, r.Header.Get("X-Forwarded-Host"))
		w.WriteHeader(http.StatusOK)
		_, err := w.Write([]byte("OK"))
		require.NoError(t, err)
	}))
	defer proxyServer.Close()

	kubeConfigStore := kubeconfig.NewContextStore()

	err := kubeConfigStore.AddContext(&kubeconfig.Context{
		Name: "test",
		Cluster: &api.Cluster{
			Server: proxyServer.URL,
		},
	})
	require.NoError(t, err)

	cache := cache.New[interface{}]()

	c := HeadlampConfig{
		useInCluster:    false,
		kubeConfigPath:  config.GetDefaultKubeConfigPath(),
		cache:           cache,
		kubeConfigStore: kubeConfigStore,
	}

	handler := createHeadlampHandler(&c)

	// Create a test request to the cluster API endpoint
	ctx := context.Background()
	req, err := http.NewRequestWithContext(ctx, "GET", "/clusters/test/version", nil)
	require.NoError(t, err)

	// Create a response recorder to capture the response
	rr := httptest.NewRecorder()

	// Serve the test request
	handler.ServeHTTP(rr, req)

	// Check the status code and response body
	assert.Equal(t, http.StatusOK, rr.Code)
	assert.Equal(t, "OK", rr.Body.String())
}

// test for keeping the original name of a cluster

func TestRenameCluster(t *testing.T) {
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
		kubeConfigPath:        "./headlamp_testdata/kubeconfig",
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

	tests := []struct {
		name          string
		clusterReq    RenameClusterRequest
		expectedState int
	}{
		{
			name: "passStatefull",
			clusterReq: RenameClusterRequest{
				NewClusterName: "minikubetestworks",
				Stateless:      false,
				Source:         "kubeconfig",
			},
			expectedState: http.StatusCreated,
		},
		{
			name: "stateless",
			clusterReq: RenameClusterRequest{
				NewClusterName: "minikubetestworks",
				Stateless:      true,
			},
			expectedState: http.StatusCreated,
		},
	}

	for _, tc := range tests {
		r, err = getResponseFromRestrictedEndpoint(handler, "PUT", "/cluster/minikubetest", tc.clusterReq)
		require.NoError(t, err)
		assert.Equal(t, tc.expectedState, r.Code)
	}
}

func TestFileExists(t *testing.T) {
	// Test for existing file
	assert.True(t, fileExists("./headlamp_testdata/kubeconfig"),
		"fileExists() should return true for existing file")

	// Test for non-existent file
	assert.False(t, fileExists("./headlamp_testdata/nonexistent"),
		"fileExists() should return false for non-existent file")

	// Test for directory
	assert.False(t, fileExists("./headlamp_testdata"),
		"fileExists() should return false for directory")
}

func TestCopyReplace(t *testing.T) {
	// Create temporary source and destination files
	srcFile, err := os.CreateTemp("", "src_file_*")
	require.NoError(t, err)

	defer os.Remove(srcFile.Name())

	dstFile, err := os.CreateTemp("", "dst_file_*")
	require.NoError(t, err)

	defer os.Remove(dstFile.Name())

	// Write test content to source file
	_, err = srcFile.WriteString("Hello, World! This is a test.")
	require.NoError(t, err)

	srcFile.Close()

	// Test successful copy and replace
	copyReplace(srcFile.Name(), dstFile.Name(),
		[]byte("Hello"), []byte("Hi"),
		[]byte("test"), []byte("example"))

	dstContent, err := os.ReadFile(dstFile.Name())
	require.NoError(t, err)

	assert.Equal(t, "Hi, World! This is a example.", string(dstContent), "copyReplace() should correctly replace content")
}

//nolint:funlen
func TestBaseURLReplace(t *testing.T) {
	// Create a temporary directory for testing
	tempDir, err := os.MkdirTemp("", "baseurl_test")
	require.NoError(t, err)

	defer os.RemoveAll(tempDir)

	// Create a sample index.html file
	indexContent := []byte(`<!DOCTYPE html>
<html>
<head>
    <script>var headlampBaseUrl = './';</script>
    <link rel="stylesheet" href="./styles.css">
</head>
<body>
    <img src="./image.png">
</body>
</html>`)
	err = os.WriteFile(
		filepath.Join(tempDir,
			"index.html"),
		indexContent,
		0o600)

	require.NoError(t, err)

	// Test cases
	testCases := []struct {
		name           string
		baseURL        string
		expectedOutput string
	}{
		{
			name:    "Empty base URL",
			baseURL: "",
			expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <script>var headlampBaseUrl = '/';</script>
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <img src="/image.png">
</body>
</html>`,
		},
		{
			name:    "Custom base URL",
			baseURL: "/custom",
			expectedOutput: `<!DOCTYPE html>
<html>
<head>
    <script>var headlampBaseUrl = '/custom';</script>
    <link rel="stylesheet" href="/custom/styles.css">
</head>
<body>
    <img src="/custom/image.png">
</body>
</html>`,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			baseURLReplace(tempDir, tc.baseURL)

			// Read the modified index.html
			modifiedContent, err := os.ReadFile(filepath.Join(tempDir, "index.html"))
			require.NoError(t, err)

			assert.Equal(t, tc.expectedOutput, string(modifiedContent))
		})
	}
}

func TestGetOidcCallbackURL(t *testing.T) {
	tests := []struct {
		name           string
		request        *http.Request
		config         *HeadlampConfig
		expectedResult string
	}{
		{
			name: "HTTPS request with no base URL",
			request: &http.Request{
				URL:  &url.URL{Scheme: "https"},
				Host: "example.com",
				TLS:  &tls.ConnectionState{},
			},
			config:         &HeadlampConfig{baseURL: ""},
			expectedResult: "https://example.com/oidc-callback",
		},
		{
			name: "HTTP request with base URL",
			request: &http.Request{
				URL:  &url.URL{Scheme: "http"},
				Host: "example.com",
			},
			config:         &HeadlampConfig{baseURL: "/headlamp"},
			expectedResult: "http://example.com/headlamp/oidc-callback",
		},
		{
			name: "Request with X-Forwarded-Proto header",
			request: &http.Request{
				URL:    &url.URL{},
				Host:   "example.com",
				Header: http.Header{"X-Forwarded-Proto": []string{"https"}},
			},
			config:         &HeadlampConfig{baseURL: ""},
			expectedResult: "https://example.com/oidc-callback",
		},
		{
			name: "Localhost request",
			request: &http.Request{
				URL:  &url.URL{},
				Host: "localhost:8080",
			},
			config:         &HeadlampConfig{baseURL: ""},
			expectedResult: "http://localhost:8080/oidc-callback",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := getOidcCallbackURL(tt.request, tt.config)
			if result != tt.expectedResult {
				t.Errorf("getOidcCallbackURL() = %v, want %v", result, tt.expectedResult)
			}
		})
	}
}

func TestParseClusterAndToken(t *testing.T) {
	ctx := context.Background()
	req, err := http.NewRequestWithContext(ctx, "GET", "/clusters/test-cluster/api", nil)
	require.NoError(t, err)
	req.Header.Set("Authorization", "Bearer test-token")

	cluster, token := parseClusterAndToken(req)
	assert.Equal(t, "test-cluster", cluster)
	assert.Equal(t, "test-token", token)
}

func TestIsTokenAboutToExpire(t *testing.T) {
	// Token that expires in 4 minutes
	header := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9."
	originalPayload := "eyJleHAiOjE2MTIzNjE2MDB9"
	signature := ".7vl9iBWGDQdXUTbEsqFHiHoaNWxKn4UwLhO9QDhXrpM"

	token := header + originalPayload + signature
	result := isTokenAboutToExpire(token)
	assert.True(t, result)

	modifiedPayload := strings.Replace(originalPayload, "J", "-", 1)

	token = header + modifiedPayload + signature
	result = isTokenAboutToExpire(token)
	assert.False(t, result, "Expected to return false when payload decoding fails due to URL-safe characters")
}

func TestOIDCTokenRefreshMiddleware(t *testing.T) {
	config := &HeadlampConfig{
		cache: cache.New[interface{}](),
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	middleware := config.OIDCTokenRefreshMiddleware(handler)

	// Test case: non-cluster request
	req := httptest.NewRequest("GET", "/non-cluster", nil)
	rec := httptest.NewRecorder()
	middleware.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)

	// Test case: cluster request without token
	req = httptest.NewRequest("GET", "/clusters/test-cluster", nil)
	rec = httptest.NewRecorder()
	middleware.ServeHTTP(rec, req)
	assert.Equal(t, http.StatusOK, rec.Code)
}

func TestStartHeadlampServer(t *testing.T) {
	// Create a temporary directory for plugins
	tempDir, err := os.MkdirTemp("", "headlamp-test")
	require.NoError(t, err)

	defer os.RemoveAll(tempDir)

	config := &HeadlampConfig{
		port:            8080,
		cache:           cache.New[interface{}](),
		kubeConfigStore: kubeconfig.NewContextStore(),
		pluginDir:       tempDir,
	}

	// Use a channel to signal when the server is ready
	ready := make(chan struct{})

	// Use a goroutine to start the server
	go func() {
		// Signal that the server is about to start
		close(ready)
		StartHeadlampServer(config)
	}()

	// Wait for the server to be ready
	<-ready

	// Give the server a moment to start
	time.Sleep(100 * time.Millisecond)

	// Try to connect to the server
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	req, err := http.NewRequestWithContext(ctx, "GET", "http://localhost:8080/config", nil)
	if err != nil {
		t.Fatalf("Failed to create request: %v", err)
	}

	client := &http.Client{}

	resp, err := client.Do(req)
	if err == nil {
		defer resp.Body.Close()
	}

	assert.NoError(t, err, "Server should be running and accepting connections")

	// If the server started successfully, we should get a response
	if resp != nil {
		assert.Equal(t, http.StatusOK, resp.StatusCode, "Server should return OK status")
	}
}

//nolint:funlen
func TestHandleClusterHelm(t *testing.T) {
	// Set up test environment
	os.Setenv("HEADLAMP_BACKEND_TOKEN", "test-token")
	defer os.Unsetenv("HEADLAMP_BACKEND_TOKEN")

	config := &HeadlampConfig{
		cache:           cache.New[interface{}](),
		kubeConfigStore: kubeconfig.NewContextStore(),
	}

	// Add a mock context to the kubeConfigStore
	mockContext := &kubeconfig.Context{
		Name: "test-cluster",
		Cluster: &api.Cluster{
			Server: "https://test-cluster.example.com",
		},
		AuthInfo: &api.AuthInfo{
			Token: "test-token",
		},
	}

	err := config.kubeConfigStore.AddContext(mockContext)
	require.NoError(t, err, "Failed to add mock context to kubeConfigStore")

	router := mux.NewRouter()
	handleClusterHelm(config, router)

	// Test cases for failed cases
	testCases := []struct {
		name           string
		method         string
		path           string
		token          string
		expectedStatus int
	}{
		{
			"List Releases - Valid Token",
			"GET",
			"/clusters/test-cluster/helm/releases/list",
			"test-token", http.StatusInternalServerError,
		},
		{
			"Install Release - Valid Token",
			"POST",
			"/clusters/test-cluster/helm/release/install",
			"test-token",
			http.StatusBadRequest,
		},
		{
			"Get Release History - Valid Token",
			"GET",
			"/clusters/test-cluster/helm/release/history",
			"test-token",
			http.StatusInternalServerError,
		},
		{
			"List Releases - Invalid Token",
			"GET",
			"/clusters/test-cluster/helm/releases/list",
			"invalid-token",
			http.StatusForbidden,
		},
		{
			"Install Release - No Token",
			"POST",
			"/clusters/test-cluster/helm/release/install",
			"",
			http.StatusForbidden,
		},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			req := httptest.NewRequest(tc.method, tc.path, nil)
			if tc.token != "" {
				req.Header.Set("X-HEADLAMP_BACKEND-TOKEN", tc.token)
			}

			w := httptest.NewRecorder()

			router.ServeHTTP(w, req)

			assert.Equal(t, tc.expectedStatus, w.Code)
		})
	}
}

// test for handleHeadlampInfo, currently checks for headlamp_info field and headlamp_info.originalName field.
//
//nolint:funlen
func TestHandleHeadlampInfo(t *testing.T) {
	// Define test cases
	tests := []struct {
		name          string
		configFile    string
		expectedError bool
		validateFunc  func(*testing.T, *kubeconfig.Context)
	}{
		{
			name:       "Empty headlamp_info",
			configFile: "kubeconfig_headlampinfo",
			validateFunc: func(t *testing.T, ctx *kubeconfig.Context) {
				assert.NotNil(t, ctx.KubeContext.Extensions["headlamp_info"], "headlamp_info field should be present")
			},
		},
		{
			name:       "Existing valid headlamp_info original name",
			configFile: "kubeconfig_headlampinfo",
			validateFunc: func(t *testing.T, ctx *kubeconfig.Context) {
				ext, ok := ctx.KubeContext.Extensions["headlamp_info"]
				require.True(t, ok, "headlamp_info not found in Extensions")

				// Convert the runtime.Object to a map
				unstructuredMap, err := runtime.DefaultUnstructuredConverter.ToUnstructured(ext)
				require.NoError(t, err, "failed to convert runtime.Object to map")

				headlampInfo := unstructuredMap

				// Check the originalName field
				originalName, ok := headlampInfo["originalName"].(string)
				require.True(t, ok, "headlamp_info.originalName missing or invalid")
				assert.NotEmpty(t, originalName, "headlamp_info.originalName should not be empty")
			},
		},
		{
			name:       "Existing valid headlamp_info source path",
			configFile: "kubeconfig_headlampinfo",
			validateFunc: func(t *testing.T, ctx *kubeconfig.Context) {
				ext, ok := ctx.KubeContext.Extensions["headlamp_info"]
				require.True(t, ok, "headlamp_info not found in Extensions")

				// Convert the runtime.Object to a map
				unstructuredMap, err := runtime.DefaultUnstructuredConverter.ToUnstructured(ext)
				require.NoError(t, err, "failed to convert runtime.Object to map")

				headlampInfo := unstructuredMap

				// Check the sourcePath field
				sourcePath, ok := headlampInfo["sourcePath"].(string)
				require.True(t, ok, "headlamp_info.sourcePath missing or invalid")
				assert.NotEmpty(t, sourcePath, "headlamp_info.sourcePath should not be empty")
			},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// create a temp directory for our test kubeconfig
			tmpDir := t.TempDir()
			mockConfigFile := filepath.Join(tmpDir, "config")

			// copy test data to the temp directory
			testDataPath := filepath.Join("headlamp_testdata", tt.configFile)
			testData, err := os.ReadFile(testDataPath)
			require.NoError(t, err, "failed to read test data for '%s'", tt.configFile)

			err = os.WriteFile(mockConfigFile, testData, 0o600)
			require.NoError(t, err, "failed to write test kubeconfig")

			// load the kubeconfig file
			config, err := clientcmd.LoadFromFile(mockConfigFile)
			require.NoError(t, err, "failed to load kubeconfig")

			// Create a HeadlampConfig object
			c := &HeadlampConfig{
				useInCluster:    false,
				cache:           cache.New[interface{}](),
				kubeConfigStore: kubeconfig.NewContextStore(),
				kubeConfigPath:  mockConfigFile,
			}

			// create a slice to hold the kubeconfig.Context objects
			kubeContexts := make([]*kubeconfig.Context, 0, len(config.Contexts))

			// loop through each context and push the kubeContext object into the slice
			for contextName, context := range config.Contexts {
				kubeContext := &kubeconfig.Context{
					Name:        contextName,
					KubeContext: context,
					Source:      1,
					Cluster:     config.Clusters[context.Cluster],
					AuthInfo:    config.AuthInfos[context.AuthInfo],
				}
				kubeContexts = append(kubeContexts, kubeContext)
			}

			// use the kubeContexts slice for further processing
			for _, ctx := range kubeContexts {
				// Call handleHeadlampInfo
				err = c.handleHeadlampInfo(ctx)
				if err != nil {
					fmt.Println("Error:", err)
				}
			}

			// use the kubeContexts slice for further processing
			for _, ctx := range kubeContexts {
				if tt.expectedError {
					require.Error(t, err, "expected an error but got none")
				} else {
					require.NoError(t, err, "failed to handle headlamp_info")

					if tt.validateFunc != nil {
						tt.validateFunc(t, ctx)
					}
				}
			}
		})
	}
}

package kubeconfig_test

import (
	"context"
	"encoding/base64"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"k8s.io/client-go/tools/clientcmd/api"
)

const kubeConfigFilePath = "./test_data/kubeconfig1"

func TestLoadAndStoreKubeConfigs(t *testing.T) {
	contextStore := kubeconfig.NewContextStore()

	t.Run("valid_file", func(t *testing.T) {
		kubeConfigFile := kubeConfigFilePath

		err := kubeconfig.LoadAndStoreKubeConfigs(contextStore, kubeConfigFile, kubeconfig.KubeConfig)
		require.NoError(t, err)

		contexts, err := contextStore.GetContexts()
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))

		ctx, err := contextStore.GetContext("minikube")
		require.NoError(t, err)

		require.Equal(t, "minikube", ctx.Name)
	})

	t.Run("invalid_file", func(t *testing.T) {
		kubeConfigFile := "invalid_kubeconfig"

		err := kubeconfig.LoadAndStoreKubeConfigs(contextStore, kubeConfigFile, kubeconfig.KubeConfig)
		require.Error(t, err)
	})
}

func TestLoadContextsFromKubeConfigFile(t *testing.T) {
	t.Run("valid_file", func(t *testing.T) {
		kubeConfigFile := kubeConfigFilePath

		contexts, errs := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.Empty(t, errs, "Expected no errors for valid file")
		require.Equal(t, 2, len(contexts), "Expected 2 contexts from valid file")
	})

	t.Run("invalid_file", func(t *testing.T) {
		kubeConfigFile := "invalid_kubeconfig"

		contexts, errs := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.NotEmpty(t, errs, "Expected errors for invalid file")
		require.Empty(t, contexts, "Expected no contexts from invalid file")
	})

	t.Run("autherror", func(t *testing.T) {
		kubeConfigFile := "./test_data/kubeconfig_autherr"

		contexts, errs := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.NotEmpty(t, errs, "Expected errors for invalid auth file")
		require.Empty(t, contexts, "Expected no contexts from invalid auth file")
	})

	t.Run("partially_valid_contexts", func(t *testing.T) {
		kubeConfigFile := "./test_data/kubeconfig_partialcontextvalid"

		contexts, errs := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.NotEmpty(t, errs, "Expected some errors for partially valid file")
		require.NotEmpty(t, contexts, "Expected some valid contexts from partially valid file")
		require.Equal(t, 1, len(contexts), "Expected one context from the partially valid file")
		require.Equal(t, "valid-context", contexts[0].Name, "Expected context name to be 'valid-context'")
	})
}

func TestContext(t *testing.T) {
	kubeConfigFile := config.GetDefaultKubeConfigPath()

	configStore := kubeconfig.NewContextStore()

	err := kubeconfig.LoadAndStoreKubeConfigs(configStore, kubeConfigFile, kubeconfig.KubeConfig)
	require.NoError(t, err)

	testContext, err := configStore.GetContext("minikube")
	require.NoError(t, err)

	require.Equal(t, "minikube", testContext.Name)
	require.NotNil(t, testContext.ClientConfig())
	require.Equal(t, "default", testContext.KubeContext.Namespace)

	restConf, err := testContext.RESTConfig()
	require.NoError(t, err)
	require.NotNil(t, restConf)

	// Test proxy request handler

	request, err := http.NewRequestWithContext(context.Background(), "GET", "/version", nil)
	require.NoError(t, err)

	rr := httptest.NewRecorder()

	err = testContext.ProxyRequest(rr, request)
	require.NoError(t, err)
	assert.Equal(t, http.StatusOK, rr.Code)

	t.Logf("Proxy request Response: %s", rr.Body.String())
	assert.Contains(t, rr.Body.String(), "major")
	assert.Contains(t, rr.Body.String(), "minor")
}

func TestLoadContextsFromBase64String(t *testing.T) {
	t.Run("valid_base64", func(t *testing.T) {
		// Read the content of the kubeconfig file
		kubeConfigFile := kubeConfigFilePath
		kubeConfigContent, err := os.ReadFile(kubeConfigFile)
		require.NoError(t, err)

		// Encode the content using base64 encoding
		base64String := base64.StdEncoding.EncodeToString(kubeConfigContent)

		contexts, errs := kubeconfig.LoadContextsFromBase64String(base64String, kubeconfig.DynamicCluster)
		require.Empty(t, errs, "Expected no errors for valid base64")
		require.Equal(t, 2, len(contexts), "Expected 2 contexts from valid base64")
		assert.Equal(t, kubeconfig.DynamicCluster, contexts[0].Source)
	})

	t.Run("invalid_base64", func(t *testing.T) {
		invalidBase64String := "invalid_base64"
		source := 2

		contexts, errs := kubeconfig.LoadContextsFromBase64String(invalidBase64String, source)
		require.NotEmpty(t, errs, "Expected errors for invalid base64")
		require.Empty(t, contexts, "Expected no contexts from invalid base64")
	})

	t.Run("partially_valid_base64", func(t *testing.T) {
		// Create a partially valid kubeconfig content
		partiallyValidContent := `
apiVersion: v1
kind: Config
contexts:
- name: valid-context
  context:
    cluster: valid-cluster
    user: valid-user
- name: invalid-context
  context:
    cluster: invalid-cluster
    user: invalid-user
clusters:
- name: valid-cluster
  cluster:
    server: https://valid.example.com
users:
- name: valid-user
  user:
    token: valid-token
`
		base64String := base64.StdEncoding.EncodeToString([]byte(partiallyValidContent))

		contexts, errs := kubeconfig.LoadContextsFromBase64String(base64String, kubeconfig.DynamicCluster)
		require.NotEmpty(t, errs, "Expected some errors for partially valid base64")
		require.NotEmpty(t, contexts, "Expected some valid contexts from partially valid base64")
		require.Equal(t, 1, len(contexts), "Expected one valid context from partially valid base64")
		assert.Equal(t, "valid-context", contexts[0].Name, "Expected context name to be 'valid-context'")
	})
}

func TestSetClusterField(t *testing.T) {
	cluster := &api.Cluster{}

	t.Run("set insecure-skip-tls-verify", func(t *testing.T) {
		err := kubeconfig.SetClusterField(cluster, "insecure-skip-tls-verify", true)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if !cluster.InsecureSkipTLSVerify {
			t.Error("Expected InsecureSkipTLSVerify to be true")
		}
	})

	t.Run("set disable-compression", func(t *testing.T) {
		err := kubeconfig.SetClusterField(cluster, "disable-compression", true)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if !cluster.DisableCompression {
			t.Error("Expected DisableCompression to be true")
		}
	})

	t.Run("invalid bool value", func(t *testing.T) {
		err := kubeconfig.SetClusterField(cluster, "insecure-skip-tls-verify", "not a bool")
		if err == nil {
			t.Fatal("Expected an error, got nil")
		}
	})

	t.Run("set certificate-authority-data", func(t *testing.T) {
		validBase64 := base64.StdEncoding.EncodeToString([]byte("test data"))

		err := kubeconfig.SetClusterField(cluster, "certificate-authority-data", validBase64)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if string(cluster.CertificateAuthorityData) != "test data" {
			t.Errorf("Expected 'test data', got '%s'", string(cluster.CertificateAuthorityData))
		}
	})

	t.Run("invalid base64 data", func(t *testing.T) {
		err := kubeconfig.SetClusterField(cluster, "certificate-authority-data", "not base64")
		if err == nil {
			t.Fatal("Expected an error, got nil")
		}
	})

	t.Run("invalid extensions", func(t *testing.T) {
		err := kubeconfig.SetClusterField(cluster, "extensions", "not a map")
		if err == nil {
			t.Fatal("Expected an error, got nil")
		}
	})
}

//nolint:funlen
func TestSetAuthInfoField(t *testing.T) {
	authInfo := &api.AuthInfo{}

	t.Run("set client-certificate-data", func(t *testing.T) {
		validBase64 := base64.StdEncoding.EncodeToString([]byte("test cert"))

		err := kubeconfig.SetAuthInfoField(authInfo, "client-certificate-data", validBase64)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if string(authInfo.ClientCertificateData) != "test cert" {
			t.Errorf("Expected 'test cert', got '%s'", string(authInfo.ClientCertificateData))
		}
	})

	t.Run("set impersonate-groups", func(t *testing.T) {
		groups := []string{"group1", "group2"}

		err := kubeconfig.SetAuthInfoField(authInfo, "impersonate-groups", groups)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if len(authInfo.ImpersonateGroups) != 2 ||
			authInfo.ImpersonateGroups[0] != "group1" ||
			authInfo.ImpersonateGroups[1] != "group2" {
			t.Errorf("Expected [group1 group2], got %v", authInfo.ImpersonateGroups)
		}
	})

	t.Run("set impersonate-user-extra", func(t *testing.T) {
		extra := map[string][]string{
			"key1": {"value1", "value2"},
			"key2": {"value3"},
		}

		err := kubeconfig.SetAuthInfoField(authInfo, "impersonate-user-extra", extra)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if len(authInfo.ImpersonateUserExtra) != 2 ||
			len(authInfo.ImpersonateUserExtra["key1"]) != 2 ||
			authInfo.ImpersonateUserExtra["key2"][0] != "value3" {
			t.Errorf("Expected map[key1:[value1 value2] key2:[value3]], got %v", authInfo.ImpersonateUserExtra)
		}
	})

	t.Run("set auth-provider", func(t *testing.T) {
		provider := map[interface{}]interface{}{
			"name": "oidc",
			"config": map[interface{}]interface{}{
				"client-id":     "my-client",
				"client-secret": "my-secret",
			},
		}

		err := kubeconfig.SetAuthInfoField(authInfo, "auth-provider", provider)
		if err != nil {
			t.Fatalf("Expected no error, got %v", err)
		}

		if authInfo.AuthProvider == nil ||
			authInfo.AuthProvider.Name != "oidc" ||
			authInfo.AuthProvider.Config["client-id"] != "my-client" {
			t.Errorf("Expected OIDC auth provider, got %v", authInfo.AuthProvider)
		}
	})

	t.Run("invalid field", func(t *testing.T) {
		err := kubeconfig.SetAuthInfoField(authInfo, "invalid-field", "some value")
		if err == nil {
			t.Fatal("Expected an error, got nil")
		}
	})
}

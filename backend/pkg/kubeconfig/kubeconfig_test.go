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

		contexts, err := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))
	})

	t.Run("invalid_file", func(t *testing.T) {
		kubeConfigFile := "invalid_kubeconfig"

		_, err := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.Error(t, err)
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

		contexts, err := kubeconfig.LoadContextsFromBase64String(base64String, kubeconfig.DynamicCluster)
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))
		assert.Equal(t, kubeconfig.DynamicCluster, contexts[0].Source)
	})

	t.Run("invalid_base64", func(t *testing.T) {
		invalidBase64String := "invalid_base64"
		source := 2

		_, err := kubeconfig.LoadContextsFromBase64String(invalidBase64String, source)
		require.Error(t, err)
	})
}

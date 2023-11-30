package kubeconfig_test

import (
	"context"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/headlamp-k8s/headlamp/backend/pkg/config"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestLoadAndStoreKubeConfigs(t *testing.T) {
	contextStore := kubeconfig.NewContextStore()

	t.Run("valid_file", func(t *testing.T) {
		kubeConfigFile := "./test_data/kubeconfig1"

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
		kubeConfigFile := "./test_data/kubeconfig1"

		contexts, err := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.NoError(t, err)

		require.Equal(t, 2, len(contexts))
	})

	t.Run("invalid_file", func(t *testing.T) {
		kubeConfigFile := "invalid_kubeconfig"

		_, err := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.Error(t, err)
	})

	t.Run("invalid_file without any context", func(t *testing.T) {
		kubeConfigFile := "./test_data/invalid_kubeconfig_without_context"

		_, err := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.Error(t, err)
		require.Contains(t, err.Error(), "invalid configuration: context was not found")
	})

	t.Run("invalid_file client cert data value", func(t *testing.T) {
		kubeConfigFile := "./test_data/invalid_kubeconfig"

		_, err := kubeconfig.LoadContextsFromFile(kubeConfigFile, kubeconfig.KubeConfig)
		require.Error(t, err)
		require.Contains(t, err.Error(), "[invalid certificate authority data in kubeconfig]")
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

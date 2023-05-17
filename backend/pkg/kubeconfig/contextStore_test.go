package kubeconfig_test

import (
	"testing"

	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/require"
)

func TestContextStore(t *testing.T) {
	store := kubeconfig.NewContextStore()

	// Test AddContext

	err := store.AddContext(&kubeconfig.Context{Name: "test"})
	require.NoError(t, err)

	// Add another context
	err = store.AddContext(&kubeconfig.Context{Name: "test2"})
	require.NoError(t, err)

	// Test GetContexts
	contexts, err := store.GetContexts()
	require.NoError(t, err)
	require.Equal(t, 2, len(contexts))

	// Test GetContext
	_, err = store.GetContext("non-existent-context")
	require.Error(t, err)

	context, err := store.GetContext("test")
	require.NoError(t, err)
	require.Equal(t, "test", context.Name)

	// Test RemoveContext
	err = store.RemoveContext("test")
	require.NoError(t, err)

	_, err = store.GetContext("test")
	require.Error(t, err)
	require.Equal(t, kubeconfig.ErrNotFound, err)
}

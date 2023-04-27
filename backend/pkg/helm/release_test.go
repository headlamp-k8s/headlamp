//go:build integration
// +build integration

package helm

import (
	"os/user"
	"path/filepath"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"helm.sh/helm/v3/pkg/action"
	"k8s.io/client-go/tools/clientcmd"
)

func GetDefaultKubeConfigPath(t *testing.T) string {
	t.Helper()

	user, err := user.Current()
	require.NoError(t, err)

	homeDirectory := user.HomeDir

	return filepath.Join(homeDirectory, ".kube", "config")
}

func GetClient(t *testing.T, clusterName string) clientcmd.ClientConfig {
	t.Helper()
	kubeConfigPath := GetDefaultKubeConfigPath(t)

	config, err := clientcmd.LoadFromFile(kubeConfigPath)
	require.NoError(t, err)

	return clientcmd.NewInteractiveClientConfig(*config, clusterName, nil, nil, nil)
}

func TestInstallRelease(t *testing.T) {
	k8sclient := GetClient(t, "minikube")

	helmHandler, err := NewHandlerWithSettings(k8sclient, "default", settings)
	require.NoError(t, err)

	// add headlmap repo
	err = AddRepository("headlamp", "https://headlamp-k8s.github.io/headlamp/", settings)
	require.NoError(t, err)

	// TODO: uninstall release if it already exists
	listClient := action.NewList(helmHandler.Configuration)
	listClient.AllNamespaces = true
	listClient.Filter = "helm-test-asdf"
	releases, err := listClient.Run()
	require.NoError(t, err)

	if len(releases) > 0 {
		t.Log("release helm-test-asdf already exists so cleaning up")
		uninstallReq := UninstallReleaseRequest{
			Name:      "helm-test-asdf",
			Namespace: "default",
		}
		helmHandler.uninstallRelease(uninstallReq)
	}

	installReq := InstallRequest{
		CommonInstallUpdateRequest: CommonInstallUpdateRequest{
			Name:        "helm-test-asdf",
			Namespace:   "default",
			Description: "install headlamp",
			Chart:       "headlamp/headlamp",
			Values:      "",
			Version:     "0.9.0",
		},
	}

	helmHandler.installRelease(installReq)

	status, err := actionState.GetStatus("install", "helm-test-asdf")
	assert.NoError(t, err)
	assert.Equal(t, "success", status)
}

func TestListRelease(t *testing.T) {
	k8sclient := GetClient(t, "minikube")

	helmHandler, err := NewHandlerWithSettings(k8sclient, "default", settings)
	require.NoError(t, err)

	req := ListReleaseRequest{}

	releases, err := getReleases(req, helmHandler.Configuration)
	assert.NoError(t, err)
	assert.NotEqual(t, 0, len(releases))

	for _, release := range releases {
		release := release
		if release.Name == "helm-test-asdf" {
			assert.Equal(t, "default", release.Namespace)
			assert.Equal(t, "0.9.0", release.Chart.Metadata.Version)
		}
	}
}

func TestUpgradeRelease(t *testing.T) {
	k8sclient := GetClient(t, "minikube")

	helmHandler, err := NewHandlerWithSettings(k8sclient, "default", settings)
	require.NoError(t, err)

	upgradeReq := UpgradeReleaseRequest{
		CommonInstallUpdateRequest: CommonInstallUpdateRequest{
			Name:        "helm-test-asdf",
			Namespace:   "default",
			Description: "upgrade headlamp",
			Chart:       "headlamp/headlamp",
			Values:      "",
			Version:     "0.11.0",
		},
	}

	helmHandler.upgradeRelease(upgradeReq)

	status, err := actionState.GetStatus("upgrade", "helm-test-asdf")
	assert.NoError(t, err)
	assert.Equal(t, "success", status)
}

func TestRollbackRelease(t *testing.T) {
	k8sclient := GetClient(t, "minikube")

	helmHandler, err := NewHandlerWithSettings(k8sclient, "default", settings)
	require.NoError(t, err)

	rollbackReq := RollbackReleaseRequest{
		Name:      "helm-test-asdf",
		Namespace: "default",
		Revision:  1,
	}
	helmHandler.rollbackRelease(rollbackReq)

	status, err := actionState.GetStatus("rollback", "helm-test-asdf")
	assert.NoError(t, err)
	assert.Equal(t, "success", status)
}

func TestUninstallRelease(t *testing.T) {
	k8sclient := GetClient(t, "minikube")

	helmHandler, err := NewHandlerWithSettings(k8sclient, "default", settings)
	require.NoError(t, err)

	uninstallReq := UninstallReleaseRequest{
		Name:      "helm-test-asdf",
		Namespace: "default",
	}

	helmHandler.uninstallRelease(uninstallReq)

	status, err := actionState.GetStatus("uninstall", "helm-test-asdf")
	assert.NoError(t, err)
	assert.Equal(t, "success", status)
}

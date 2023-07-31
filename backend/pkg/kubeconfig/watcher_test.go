package kubeconfig_test

import (
	"os"
	"runtime"
	"strings"
	"testing"
	"time"

	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/require"
	"k8s.io/client-go/tools/clientcmd"
)

const clusterConf = `apiVersion: v1
clusters:
- cluster:
    certificate-authority-data: dGVzdA==
    server: https://kubernetes.docker.internal:6443
  name: random-cluster-4
contexts:
- context:
    cluster: random-cluster-4
    user: random-cluster-4
  name: random-cluster-4
current-context: random-cluster-4
kind: Config
preferences: {}
users:
- name: random-cluster-4
  user:
  client-certificate-data: dGVzdA==
  client-key-data: dGVzdA==`

func TestWatchAndLoadFiles(t *testing.T) {
	paths := []string{"./test_data/kubeconfig1", "./test_data/kubeconfig2", "./test_data/kubeconfig3"}

	var path string
	if runtime.GOOS == "windows" {
		path = strings.Join(paths, ";")
	} else {
		path = strings.Join(paths, ":")
	}

	kubeConfigStore := kubeconfig.NewContextStore()

	go kubeconfig.LoadAndWatchFiles(kubeConfigStore, path, kubeconfig.KubeConfig)

	// SLeep so the config file has a different time stamp.
	time.Sleep(5 * time.Second)

	// create kubeconfig3 file that doesn't exist
	conf, err := clientcmd.Load([]byte(clusterConf))
	require.NoError(t, err)
	require.NotNil(t, conf)

	err = clientcmd.WriteToFile(*conf, "./test_data/kubeconfig3")
	require.NoError(t, err)

	t.Log("created kubeconfig3 file")

	// check if kubeconfig3 is loaded
	context, err := kubeConfigStore.GetContext("random-cluster-4")

	// loop for until GetContext returns "random-cluster-4" or 30 seconds has past
	for i := 0; i < 30; i++ {
		if err == nil && context.Name == "random-cluster-4" {
			break
		}

		time.Sleep(1 * time.Second)

		context, err = kubeConfigStore.GetContext("random-cluster-4")
	}

	require.NoError(t, err)
	require.Equal(t, "random-cluster-4", context.Name)

	// delete kubeconfig3 file
	err = os.Remove("./test_data/kubeconfig3")
	require.NoError(t, err)
}

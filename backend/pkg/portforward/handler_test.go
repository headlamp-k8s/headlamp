package portforward_test

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"net/url"
	"os"
	"os/user"
	"path/filepath"
	"testing"
	"time"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	"github.com/headlamp-k8s/headlamp/backend/pkg/cache"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/headlamp-k8s/headlamp/backend/pkg/portforward"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func getDefaultKubeConfigPath(t *testing.T) string {
	t.Helper()

	user, err := user.Current()
	require.NoError(t, err)

	homeDirectory := user.HomeDir

	return filepath.Join(homeDirectory, ".kube", "config")
}

//nolint:funlen
func TestStartPortForward(t *testing.T) {
	t.Parallel()

	if os.Getenv("HEADLAMP_RUN_INTEGRATION_TESTS") != "true" {
		t.Skip("skipping integration test")
	}

	// create cache
	ch := cache.New[interface{}]()

	// create kubeconfig store
	kubeConfigStore := kubeconfig.NewContextStore()

	// load kubeconfig
	kubeConfigPath := getDefaultKubeConfigPath(t)
	kContexts, err := kubeconfig.LoadContextsFromFile(kubeConfigPath, kubeconfig.KubeConfig)
	require.NoError(t, err)
	require.NotEmpty(t, kContexts)

	kc := kContexts[0]
	err = kubeConfigStore.AddContext(&kc)
	require.NoError(t, err)

	// find a pod to portforward to
	clientSet, err := kc.ClientSetWithToken("")
	require.NoError(t, err)
	require.NotNil(t, clientSet)

	podList, err := clientSet.CoreV1().Pods("headlamp").List(context.Background(), metav1.ListOptions{})
	require.NoError(t, err)
	require.NotEmpty(t, podList)

	podName := ""
	targetPort := ""
	// select the pod and make sure it has a port to forward to.
	for _, pod := range podList.Items {
		if len(pod.Spec.Containers) > 0 && len(pod.Spec.Containers[0].Ports) > 0 {
			podName = pod.Name
			targetPort = fmt.Sprint(pod.Spec.Containers[0].Ports[0].ContainerPort)
		}
	}

	require.NotEmpty(t, podName)
	require.NotEmpty(t, targetPort)

	// start portforward
	req := &http.Request{}
	resp := httptest.NewRecorder()

	const minikubeName = "minikube"

	// create request
	reqPayload := map[string]interface{}{
		"cluster":    minikubeName,
		"pod":        podName,
		"namespace":  "headlamp",
		"targetPort": targetPort,
	}

	jsonReq, err := json.Marshal(reqPayload)
	require.NoError(t, err)

	req.Body = io.NopCloser(bytes.NewReader(jsonReq))

	portforward.StartPortForward(kubeConfigStore, ch, resp, req)

	res := resp.Result()
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode)

	data, err := io.ReadAll(res.Body)
	require.NoError(t, err)
	require.NotEmpty(t, data)
	require.Contains(t, string(data), targetPort)

	// get port from response
	var pfRespPayload map[string]interface{}
	err = json.Unmarshal(data, &pfRespPayload)
	require.NoError(t, err)

	port := pfRespPayload["port"].(string)

	// To test the pod uptime check is working
	time.Sleep(7 * time.Second)

	// check if portforward is running
	req, err = http.NewRequestWithContext(context.Background(), "GET",
		fmt.Sprintf("http://localhost:%s/config", port), nil)
	require.NoError(t, err)

	pfResp, err := http.DefaultClient.Do(req)
	require.NoError(t, err)

	defer pfResp.Body.Close()

	require.Equal(t, http.StatusOK, pfResp.StatusCode)

	pfRespData, err := io.ReadAll(pfResp.Body)
	require.NoError(t, err)
	require.NotEmpty(t, pfRespData)

	assert.Contains(t, string(pfRespData), "incluster")

	// stop portforward
	req = &http.Request{}
	resp = httptest.NewRecorder()

	// create stop request
	reqPayload = map[string]interface{}{
		"cluster":      minikubeName,
		"id":           pfRespPayload["id"],
		"stopOrDelete": true,
	}

	jsonReq, err = json.Marshal(reqPayload)
	require.NoError(t, err)

	req.Body = io.NopCloser(bytes.NewReader(jsonReq))

	portforward.StopOrDeletePortForward(ch, resp, req)

	res = resp.Result()
	defer res.Body.Close()

	stopRespBody, err := io.ReadAll(res.Body)
	require.NoError(t, err)

	require.Contains(t, string(stopRespBody), "stopped")

	// check if portforward is stopped
	chState, err := ch.Get(context.Background(), "PORT_FORWARD_minikube"+pfRespPayload["id"].(string))
	require.NoError(t, err)

	chData, err := json.Marshal(chState)
	require.NoError(t, err)

	assert.Contains(t, string(chData), "Stopped")

	// list portforwards
	req = &http.Request{}
	resp = httptest.NewRecorder()
	req.URL = &url.URL{}
	req.URL.RawQuery = "cluster=minikube"

	portforward.GetPortForwards(ch, resp, req)

	res = resp.Result()
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode)

	data, err = io.ReadAll(res.Body)
	require.NoError(t, err)
	require.NotEmpty(t, data)

	var pfListRespPayload []map[string]interface{}
	err = json.Unmarshal(data, &pfListRespPayload)
	require.NoError(t, err)

	assert.NotEmpty(t, pfListRespPayload)
	assert.Contains(t, pfListRespPayload[0]["id"], pfRespPayload["id"])
	assert.Contains(t, pfListRespPayload[0]["status"], "Stopped")
	assert.Equal(t, "[", string(string(data)[0]))

	// test fetching a portforward by id
	req = &http.Request{}
	resp = httptest.NewRecorder()
	req.URL = &url.URL{}
	req.URL.RawQuery = "cluster=minikube&id=" + pfRespPayload["id"].(string)

	portforward.GetPortForwardByID(ch, resp, req)

	res = resp.Result()
	defer res.Body.Close()

	require.Equal(t, http.StatusOK, res.StatusCode)

	data, err = io.ReadAll(res.Body)
	require.NoError(t, err)

	var pfRespPayloadByID map[string]interface{}
	err = json.Unmarshal(data, &pfRespPayloadByID)
	require.NoError(t, err)

	assert.NotEmpty(t, pfRespPayloadByID)
	assert.Contains(t, pfRespPayloadByID["id"], pfRespPayload["id"])

	// delete portforward
	req = &http.Request{}
	resp = httptest.NewRecorder()

	// create delete request
	reqPayload = map[string]interface{}{
		"cluster":      minikubeName,
		"id":           pfRespPayload["id"],
		"stopOrDelete": false,
	}

	jsonReq, err = json.Marshal(reqPayload)
	require.NoError(t, err)

	req.Body = io.NopCloser(bytes.NewReader(jsonReq))

	portforward.StopOrDeletePortForward(ch, resp, req)

	res = resp.Result()
	defer res.Body.Close()

	deleteRespBody, err := io.ReadAll(res.Body)
	require.NoError(t, err)

	require.Contains(t, string(deleteRespBody), "stopped")

	// check if portforward is deleted
	chState, err = ch.Get(context.Background(), "PORT_FORWARD_minikube"+pfRespPayload["id"].(string))
	require.Error(t, err)
	require.Nil(t, chState)
}

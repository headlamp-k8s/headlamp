package main

import (
	"crypto/tls"
	"encoding/json"
	"fmt"
	"net"
	"net/http"
	"net/http/httptest"
	"strings"
	"sync"
	"testing"
	"time"

	"github.com/gorilla/websocket"
	"github.com/headlamp-k8s/headlamp/backend/pkg/kubeconfig"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"k8s.io/client-go/tools/clientcmd/api"
)

func newTestDialer() *websocket.Dialer {
	return &websocket.Dialer{
		NetDial:          net.Dial,
		HandshakeTimeout: 45 * time.Second,
		TLSClientConfig:  &tls.Config{InsecureSkipVerify: true}, //nolint:gosec
	}
}

func TestNewMultiplexer(t *testing.T) {
	store := kubeconfig.NewContextStore()
	m := NewMultiplexer(store)

	assert.NotNil(t, m)
	assert.Equal(t, store, m.kubeConfigStore)
	assert.NotNil(t, m.connections)
	assert.NotNil(t, m.upgrader)
}

func TestHandleClientWebSocket(t *testing.T) {
	contextStore := kubeconfig.NewContextStore()
	m := NewMultiplexer(contextStore)

	// Create test server
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		m.HandleClientWebSocket(w, r)
	}))
	defer server.Close()

	// Connect to test server
	dialer := newTestDialer()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	ws, resp, err := dialer.Dial(wsURL, nil)
	require.NoError(t, err)

	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
	}

	defer ws.Close()

	// Test WATCH message
	watchMsg := Message{
		Type:      "WATCH",
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		UserID:    "test-user",
	}
	err = ws.WriteJSON(watchMsg)
	require.NoError(t, err)

	// Test CLOSE message
	closeMsg := Message{
		Type:      "CLOSE",
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		UserID:    "test-user",
	}
	err = ws.WriteJSON(closeMsg)
	require.NoError(t, err)
}

func TestGetClusterConfigWithFallback(t *testing.T) {
	store := kubeconfig.NewContextStore()
	m := NewMultiplexer(store)

	// Add a mock cluster config
	err := store.AddContext(&kubeconfig.Context{
		Name: "test-cluster",
		Cluster: &api.Cluster{
			Server: "https://test-cluster.example.com",
		},
	})
	require.NoError(t, err)

	config, err := m.getClusterConfigWithFallback("test-cluster", "test-user")
	assert.NoError(t, err)
	assert.NotNil(t, config)

	// Test fallback
	config, err = m.getClusterConfigWithFallback("non-existent", "test-user")
	assert.Error(t, err)
	assert.Nil(t, config)
}

func TestCreateConnection(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, _ := createTestWebSocketConnection()

	// Add RequestID to the createConnection call
	conn := m.createConnection("test-cluster", "test-user", "/api/v1/pods", "", clientConn)
	assert.NotNil(t, conn)
	assert.Equal(t, "test-cluster", conn.ClusterID)
	assert.Equal(t, "test-user", conn.UserID)
	assert.Equal(t, "/api/v1/pods", conn.Path)
	assert.Equal(t, StateConnecting, conn.Status.State)
}

func TestDialWebSocket(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true // Allow all connections for testing
			},
		}
		ws, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			t.Logf("Upgrade error: %v", err)
			return
		}

		defer ws.Close()
		// Echo incoming messages back to the client
		for {
			mt, message, err := ws.ReadMessage()
			if err != nil {
				break
			}
			err = ws.WriteMessage(mt, message)
			if err != nil {
				break
			}
		}
	}))

	defer server.Close()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	conn, err := m.dialWebSocket(wsURL, &tls.Config{InsecureSkipVerify: true}, server.URL) //nolint:gosec

	assert.NoError(t, err)
	assert.NotNil(t, conn)

	if conn != nil {
		conn.Close()
	}
}

func TestDialWebSocket_Errors(t *testing.T) {
	contextStore := kubeconfig.NewContextStore()
	m := NewMultiplexer(contextStore)

	// Test invalid URL
	tlsConfig := &tls.Config{InsecureSkipVerify: true} //nolint:gosec

	ws, err := m.dialWebSocket("invalid-url", tlsConfig, "")
	assert.Error(t, err)
	assert.Nil(t, ws)

	// Test unreachable URL
	ws, err = m.dialWebSocket("ws://localhost:12345", tlsConfig, "")
	assert.Error(t, err)
	assert.Nil(t, ws)
}

func TestMonitorConnection(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, _ := createTestWebSocketConnection()

	// Updated createConnection call with all required arguments
	conn := m.createConnection("test-cluster", "test-user", "/api/v1/pods", "", clientConn)
	conn.WSConn, _ = createTestWebSocketConnection()

	done := make(chan struct{})
	go func() {
		m.monitorConnection(conn)
		close(done)
	}()

	time.Sleep(100 * time.Millisecond)
	close(conn.Done)
	<-done

	assert.Equal(t, StateClosed, conn.Status.State)
}

func TestUpdateStatus(t *testing.T) {
	conn := &Connection{
		Status: ConnectionStatus{},
		Done:   make(chan struct{}),
	}

	// Test different state transitions
	states := []ConnectionState{
		StateConnecting,
		StateConnected,
		StateClosed,
		StateError,
	}

	for _, state := range states {
		conn.Status.State = state
		assert.Equal(t, state, conn.Status.State)
	}

	// Test concurrent updates
	var wg sync.WaitGroup
	for i := 0; i < 10; i++ {
		wg.Add(1)

		go func(i int) {
			defer wg.Done()

			state := states[i%len(states)]
			conn.Status.State = state
		}(i)
	}
	wg.Wait()

	// Verify final state is valid
	assert.Contains(t, states, conn.Status.State)
}

func TestMonitorConnection_Reconnect(t *testing.T) {
	contextStore := kubeconfig.NewContextStore()
	m := NewMultiplexer(contextStore)

	// Create a server that will accept the connection and then close it
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}
		ws, err := upgrader.Upgrade(w, r, nil)
		require.NoError(t, err)

		defer ws.Close()

		// Keep connection alive briefly
		time.Sleep(100 * time.Millisecond)
		ws.Close()
	}))

	defer server.Close()

	conn := &Connection{
		Status: ConnectionStatus{
			State: StateConnecting,
		},
		Done: make(chan struct{}),
	}

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	tlsConfig := &tls.Config{InsecureSkipVerify: true} //nolint:gosec

	ws, err := m.dialWebSocket(wsURL, tlsConfig, "")
	require.NoError(t, err)

	conn.WSConn = ws

	// Start monitoring in a goroutine
	go m.monitorConnection(conn)

	// Wait for state transitions
	time.Sleep(300 * time.Millisecond)

	// Verify connection status, it should reconnect
	assert.Equal(t, StateConnecting, conn.Status.State)

	// Clean up
	close(conn.Done)
}

//nolint:funlen
func TestHandleClusterMessages(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, clientServer := createTestWebSocketConnection()

	defer clientServer.Close()

	clusterConn, clusterServer := createTestWebSocketConnection()

	defer clusterServer.Close()

	// Add RequestID to the createConnection call
	conn := m.createConnection("minikube", "test-user", "/api/v1/pods", "watch=true", clientConn)
	conn.WSConn = clusterConn

	done := make(chan struct{})
	go func() {
		m.handleClusterMessages(conn, clientConn)
		close(done)
	}()

	// Send a test message from the cluster
	testMessage := []byte(`{"kind":"Pod","apiVersion":"v1","metadata":{"name":"test-pod"}}`)
	err := clusterConn.WriteMessage(websocket.TextMessage, testMessage)
	require.NoError(t, err)

	// Read the message from the client connection
	_, receivedMessage, err := clientConn.ReadMessage()
	require.NoError(t, err)

	var wrapperMsg struct {
		ClusterID string `json:"clusterId"`
		Path      string `json:"path"`
		Query     string `json:"query"`
		UserID    string `json:"userId"`
		RequestID string `json:"requestId"`
		Data      string `json:"data"`
		Binary    bool   `json:"binary"`
	}

	err = json.Unmarshal(receivedMessage, &wrapperMsg)
	require.NoError(t, err)

	assert.Equal(t, "minikube", wrapperMsg.ClusterID)
	assert.Equal(t, "/api/v1/pods", wrapperMsg.Path)
	assert.Equal(t, "watch=true", wrapperMsg.Query)
	assert.Equal(t, "test-user", wrapperMsg.UserID)
	assert.False(t, wrapperMsg.Binary)

	// Parse the Data field separately
	var podData map[string]interface{}
	err = json.Unmarshal([]byte(wrapperMsg.Data), &podData)
	require.NoError(t, err)
	assert.Equal(t, "Pod", podData["kind"])
	assert.Equal(t, "v1", podData["apiVersion"])

	// Close the connection to trigger the end of handleClusterMessages
	conn.WSConn.Close()

	// Wait for handleClusterMessages to finish
	select {
	case <-done:
		// Function completed successfully
	case <-time.After(5 * time.Second):
		t.Fatal("Test timed out")
	}

	assert.Equal(t, StateConnecting, conn.Status.State)
}

func TestCleanupConnections(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, _ := createTestWebSocketConnection()
	// Add RequestID to the createConnection call
	conn := m.createConnection("test-cluster", "test-user", "/api/v1/pods", "", clientConn)
	conn.WSConn, _ = createTestWebSocketConnection()

	// Use the new connection key format
	connKey := "test-cluster:/api/v1/pods:test-request-id"
	m.connections[connKey] = conn

	m.cleanupConnections()

	assert.Empty(t, m.connections)
	assert.Equal(t, StateClosed, conn.Status.State)
}

func TestCreateWebSocketURL(t *testing.T) {
	tests := []struct {
		name     string
		host     string
		path     string
		query    string
		expected string
	}{
		{
			name:     "basic URL without query",
			host:     "http://localhost:8080",
			path:     "/api/v1/pods",
			query:    "",
			expected: "wss://localhost:8080/api/v1/pods",
		},
		{
			name:     "URL with query parameters",
			host:     "https://example.com",
			path:     "/api/v1/pods",
			query:    "watch=true",
			expected: "wss://example.com/api/v1/pods?watch=true",
		},
		{
			name:     "URL with path and multiple query parameters",
			host:     "https://k8s.example.com",
			path:     "/api/v1/namespaces/default/pods",
			query:    "watch=true&labelSelector=app%3Dnginx",
			expected: "wss://k8s.example.com/api/v1/namespaces/default/pods?watch=true&labelSelector=app%3Dnginx",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			result := createWebSocketURL(tt.host, tt.path, tt.query)
			assert.Equal(t, tt.expected, result)
		})
	}
}

func TestGetOrCreateConnection(t *testing.T) {
	store := kubeconfig.NewContextStore()
	m := NewMultiplexer(store)

	// Create a mock Kubernetes API server
	mockServer := createMockKubeAPIServer()
	defer mockServer.Close()

	// Add a mock cluster config with our test server URL
	err := store.AddContext(&kubeconfig.Context{
		Name: "test-cluster",
		Cluster: &api.Cluster{
			Server:                   mockServer.URL,
			InsecureSkipTLSVerify:    true,
			CertificateAuthorityData: nil,
		},
	})
	require.NoError(t, err)

	clientConn, clientServer := createTestWebSocketConnection()
	defer clientServer.Close()

	// Test getting a non-existent connection (should create new)
	msg := Message{
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		Query:     "watch=true",
		UserID:    "test-user",
	}

	conn, err := m.getOrCreateConnection(msg, clientConn)
	assert.NoError(t, err)
	assert.NotNil(t, conn)
	assert.Equal(t, "test-cluster", conn.ClusterID)
	assert.Equal(t, "test-user", conn.UserID)
	assert.Equal(t, "/api/v1/pods", conn.Path)
	assert.Equal(t, "watch=true", conn.Query)

	// Test getting an existing connection
	conn2, err := m.getOrCreateConnection(msg, clientConn)
	assert.NoError(t, err)
	assert.Equal(t, conn, conn2, "Should return the same connection instance")

	// Test with invalid cluster
	msg.ClusterID = "non-existent-cluster"
	conn3, err := m.getOrCreateConnection(msg, clientConn)
	assert.Error(t, err)
	assert.Nil(t, conn3)
}

func TestEstablishClusterConnection(t *testing.T) {
	store := kubeconfig.NewContextStore()
	m := NewMultiplexer(store)

	// Create a mock Kubernetes API server
	mockServer := createMockKubeAPIServer()
	defer mockServer.Close()

	// Add a mock cluster config with our test server URL
	err := store.AddContext(&kubeconfig.Context{
		Name: "test-cluster",
		Cluster: &api.Cluster{
			Server:                   mockServer.URL,
			InsecureSkipTLSVerify:    true,
			CertificateAuthorityData: nil,
		},
	})
	require.NoError(t, err)

	clientConn, clientServer := createTestWebSocketConnection()
	defer clientServer.Close()

	// Test successful connection establishment
	conn, err := m.establishClusterConnection("test-cluster", "test-user", "/api/v1/pods", "watch=true", clientConn)
	assert.NoError(t, err)
	assert.NotNil(t, conn)
	assert.Equal(t, "test-cluster", conn.ClusterID)
	assert.Equal(t, "test-user", conn.UserID)
	assert.Equal(t, "/api/v1/pods", conn.Path)
	assert.Equal(t, "watch=true", conn.Query)

	// Test with invalid cluster
	conn, err = m.establishClusterConnection("non-existent", "test-user", "/api/v1/pods", "watch=true", clientConn)
	assert.Error(t, err)
	assert.Nil(t, conn)
}

//nolint:funlen
func TestReconnect(t *testing.T) {
	store := kubeconfig.NewContextStore()
	m := NewMultiplexer(store)

	// Create a mock Kubernetes API server
	mockServer := createMockKubeAPIServer()
	defer mockServer.Close()

	// Add a mock cluster config with our test server URL
	err := store.AddContext(&kubeconfig.Context{
		Name: "test-cluster",
		Cluster: &api.Cluster{
			Server:                   mockServer.URL,
			InsecureSkipTLSVerify:    true,
			CertificateAuthorityData: nil,
		},
	})
	require.NoError(t, err)

	clientConn, clientServer := createTestWebSocketConnection()
	defer clientServer.Close()

	// Create initial connection
	conn := m.createConnection("test-cluster", "test-user", "/api/v1/pods", "watch=true", clientConn)
	conn.Status.State = StateError // Simulate an error state

	// Test successful reconnection
	newConn, err := m.reconnect(conn)
	assert.NoError(t, err)
	assert.NotNil(t, newConn)
	assert.Equal(t, StateConnected, newConn.Status.State)
	assert.Equal(t, conn.ClusterID, newConn.ClusterID)
	assert.Equal(t, conn.UserID, newConn.UserID)
	assert.Equal(t, conn.Path, newConn.Path)
	assert.Equal(t, conn.Query, newConn.Query)

	// Test reconnection with invalid cluster
	conn.ClusterID = "non-existent"
	newConn, err = m.reconnect(conn)
	assert.Error(t, err)
	assert.Nil(t, newConn)
	assert.Contains(t, err.Error(), "getting context: key not found")

	// Test reconnection with closed connection
	conn = m.createConnection("test-cluster", "test-user", "/api/v1/pods", "watch=true", clientConn)
	clusterConn, err := m.establishClusterConnection("test-cluster", "test-user", "/api/v1/pods", "watch=true", clientConn)
	require.NoError(t, err)
	require.NotNil(t, clusterConn)

	// Close the connection and wait for cleanup
	conn.closed = true
	if conn.WSConn != nil {
		conn.WSConn.Close()
	}

	if conn.Client != nil {
		conn.Client.Close()
	}

	close(conn.Done)

	// Try to reconnect the closed connection
	newConn, err = m.reconnect(conn)
	assert.Error(t, err)
	assert.Nil(t, newConn)
}

func TestCloseConnection(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, _ := createTestWebSocketConnection()
	conn := m.createConnection("test-cluster", "test-user", "/api/v1/pods", "", clientConn)
	conn.WSConn, _ = createTestWebSocketConnection()

	connKey := "test-cluster:/api/v1/pods:test-user"
	m.connections[connKey] = conn

	m.CloseConnection("test-cluster", "/api/v1/pods", "test-user")
	assert.Empty(t, m.connections)
	// It will reconnect to the cluster
	assert.Equal(t, StateConnecting, conn.Status.State)
}

func TestCreateWrapperMessage(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	conn := &Connection{
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		Query:     "watch=true",
		UserID:    "test-user",
	}

	// Test text message
	textMsg := []byte("Hello, World!")
	wrapperMsg := m.createWrapperMessage(conn, websocket.TextMessage, textMsg)
	assert.Equal(t, "test-cluster", wrapperMsg.ClusterID)
	assert.Equal(t, "/api/v1/pods", wrapperMsg.Path)
	assert.Equal(t, "watch=true", wrapperMsg.Query)
	assert.Equal(t, "test-user", wrapperMsg.UserID)
	assert.Equal(t, "Hello, World!", wrapperMsg.Data)
	assert.False(t, wrapperMsg.Binary)

	// Test binary message
	binaryMsg := []byte{0x01, 0x02, 0x03}
	wrapperMsg = m.createWrapperMessage(conn, websocket.BinaryMessage, binaryMsg)
	assert.Equal(t, "test-cluster", wrapperMsg.ClusterID)
	assert.Equal(t, "/api/v1/pods", wrapperMsg.Path)
	assert.Equal(t, "watch=true", wrapperMsg.Query)
	assert.Equal(t, "test-user", wrapperMsg.UserID)
	assert.Equal(t, "AQID", wrapperMsg.Data) // Base64 encoded
	assert.True(t, wrapperMsg.Binary)
}

func TestHandleConnectionError(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, clientServer := createTestWebSocketConnection()

	defer clientServer.Close()

	msg := Message{
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		UserID:    "test-user",
	}

	testError := fmt.Errorf("test error")

	// Capture the error message sent to the client
	var receivedMsg struct {
		ClusterID string `json:"clusterId"`
		Error     string `json:"error"`
	}

	done := make(chan bool)
	go func() {
		_, rawMsg, err := clientConn.ReadMessage()
		if err != nil {
			t.Errorf("Error reading message: %v", err)
			done <- true

			return
		}

		err = json.Unmarshal(rawMsg, &receivedMsg)
		if err != nil {
			t.Errorf("Error unmarshaling message: %v", err)
			done <- true

			return
		}

		done <- true
	}()

	m.handleConnectionError(clientConn, msg, testError)

	select {
	case <-done:
		assert.Equal(t, "test-cluster", receivedMsg.ClusterID)
		assert.Equal(t, "test error", receivedMsg.Error)
	case <-time.After(time.Second):
		t.Fatal("Test timed out")
	}
}

func TestWriteMessageToCluster(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clusterConn, clusterServer := createTestWebSocketConnection()

	defer clusterServer.Close()

	conn := &Connection{
		ClusterID: "test-cluster",
		WSConn:    clusterConn,
	}

	testMessage := []byte("Hello, Cluster!")

	// Capture the message sent to the cluster
	var receivedMessage []byte

	done := make(chan bool)
	go func() {
		_, receivedMessage, _ = clusterConn.ReadMessage()
		done <- true
	}()

	err := m.writeMessageToCluster(conn, testMessage)
	assert.NoError(t, err)

	select {
	case <-done:
		assert.Equal(t, testMessage, receivedMessage)
	case <-time.After(time.Second):
		t.Fatal("Test timed out")
	}

	// Test error case
	clusterConn.Close()

	err = m.writeMessageToCluster(conn, testMessage)

	assert.Error(t, err)
	assert.Equal(t, StateError, conn.Status.State)
}

//nolint:funlen
func TestReadClientMessage_InvalidMessage(t *testing.T) {
	contextStore := kubeconfig.NewContextStore()
	m := NewMultiplexer(contextStore)

	// Create a server that will echo messages back
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}
		ws, err := upgrader.Upgrade(w, r, nil)
		require.NoError(t, err)

		defer ws.Close()

		// Echo messages back
		for {
			messageType, p, err := ws.ReadMessage()
			if err != nil {
				return
			}
			err = ws.WriteMessage(messageType, p)
			if err != nil {
				return
			}
		}
	}))
	defer server.Close()

	// Connect to the server
	dialer := newTestDialer()

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	clientConn, _, err := dialer.Dial(wsURL, nil) //nolint:bodyclose
	require.NoError(t, err)

	defer clientConn.Close()

	// Test completely invalid JSON
	err = clientConn.WriteMessage(websocket.TextMessage, []byte("not json at all"))
	require.NoError(t, err)

	msg, err := m.readClientMessage(clientConn)
	require.Error(t, err)
	assert.Equal(t, Message{}, msg)

	// Test JSON with invalid data type
	err = clientConn.WriteJSON(map[string]interface{}{
		"type": "INVALID",
		"data": 123, // data should be string
	})
	require.NoError(t, err)

	msg, err = m.readClientMessage(clientConn)
	require.Error(t, err)
	assert.Equal(t, Message{}, msg)

	// Test empty JSON object
	err = clientConn.WriteMessage(websocket.TextMessage, []byte("{}"))
	require.NoError(t, err)

	msg, err = m.readClientMessage(clientConn)
	// Empty message is valid JSON but will be unmarshaled into an empty Message struct
	require.NoError(t, err)
	assert.Equal(t, Message{}, msg)

	// Test missing required fields
	err = clientConn.WriteJSON(map[string]interface{}{
		"data": "some data",
		// Missing type field
	})
	require.NoError(t, err)

	msg, err = m.readClientMessage(clientConn)
	// Missing fields are allowed by json.Unmarshal
	require.NoError(t, err)
	assert.Equal(t, Message{Data: "some data"}, msg)
}

func TestUpdateStatus_WithError(t *testing.T) {
	clientConn, clientServer := createTestWebSocketConnection()
	defer clientServer.Close()

	conn := &Connection{
		Status: ConnectionStatus{},
		Done:   make(chan struct{}),
		Client: clientConn,
	}

	// Test error state with message
	testErr := fmt.Errorf("test error")
	conn.updateStatus(StateError, testErr)
	assert.Equal(t, StateError, conn.Status.State)
	assert.Equal(t, testErr.Error(), conn.Status.Error)

	// Test state change without error
	conn.updateStatus(StateConnected, nil)
	assert.Equal(t, StateConnected, conn.Status.State)
	assert.Empty(t, conn.Status.Error)

	// Test with closed connection - state should remain error
	conn.updateStatus(StateError, testErr)
	assert.Equal(t, StateError, conn.Status.State)
	assert.Equal(t, testErr.Error(), conn.Status.Error)

	close(conn.Done)
	conn.closed = true // Mark connection as closed

	// Try to update state after close - should not change
	conn.updateStatus(StateConnected, nil)
	assert.Equal(t, StateError, conn.Status.State)      // State should not change after close
	assert.Equal(t, testErr.Error(), conn.Status.Error) // Error should remain
}

func TestMonitorConnection_ReconnectFailure(t *testing.T) {
	store := kubeconfig.NewContextStore()
	m := NewMultiplexer(store)

	// Add an invalid cluster config to force reconnection failure
	err := store.AddContext(&kubeconfig.Context{
		Name: "test-cluster",
		Cluster: &api.Cluster{
			Server: "https://invalid-server:8443",
		},
	})
	require.NoError(t, err)

	clientConn, _ := createTestWebSocketConnection()
	conn := m.createConnection("test-cluster", "test-user", "/api/v1/pods", "", clientConn)
	conn.WSConn, _ = createTestWebSocketConnection()

	// Start monitoring
	done := make(chan struct{})
	go func() {
		m.monitorConnection(conn)
		close(done)
	}()

	// Force connection closure and error state
	conn.updateStatus(StateError, fmt.Errorf("forced error"))
	conn.WSConn.Close()

	// Wait briefly to ensure error state is set
	time.Sleep(50 * time.Millisecond)

	// Verify connection is in error state
	assert.Equal(t, StateError, conn.Status.State)
	assert.NotEmpty(t, conn.Status.Error)

	close(conn.Done)
	<-done
}

func TestHandleClientWebSocket_InvalidMessages(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())

	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		m.HandleClientWebSocket(w, r)
	}))
	defer server.Close()

	// Test invalid JSON
	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	ws, resp, err := websocket.DefaultDialer.Dial(wsURL, nil)
	require.NoError(t, err)

	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
	}

	err = ws.WriteMessage(websocket.TextMessage, []byte("invalid json"))
	require.NoError(t, err)

	// Should receive an error message or close
	_, message, err := ws.ReadMessage()
	if err != nil {
		// Connection may be closed due to error
		if !websocket.IsCloseError(err, websocket.CloseAbnormalClosure) {
			t.Errorf("expected abnormal closure, got %v", err)
		}
	} else {
		assert.Contains(t, string(message), "error")
	}

	ws.Close()

	// Test invalid message type with new connection
	ws, resp, err = websocket.DefaultDialer.Dial(wsURL, nil)
	require.NoError(t, err)

	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
	}

	defer ws.Close()

	err = ws.WriteJSON(Message{
		Type:      "INVALID_TYPE",
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		UserID:    "test-user",
	})
	require.NoError(t, err)

	// Should receive an error message or close
	_, message, err = ws.ReadMessage()
	if err != nil {
		// Connection may be closed due to error
		if !websocket.IsCloseError(err, websocket.CloseAbnormalClosure) {
			t.Errorf("expected abnormal closure, got %v", err)
		}
	} else {
		assert.Contains(t, string(message), "error")
	}
}

func TestSendIfNewResourceVersion_VersionComparison(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, clientServer := createTestWebSocketConnection()

	defer clientServer.Close()

	conn := &Connection{
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		UserID:    "test-user",
		Client:    clientConn,
	}

	// Initialize lastVersion pointer
	lastVersion := ""

	// Test initial version
	message := []byte(`{"metadata":{"resourceVersion":"100"}}`)
	err := m.sendIfNewResourceVersion(message, conn, clientConn, &lastVersion)
	require.NoError(t, err)
	assert.Equal(t, "100", lastVersion)

	// Test same version - should not send
	err = m.sendIfNewResourceVersion(message, conn, clientConn, &lastVersion)
	require.NoError(t, err)
	assert.Equal(t, "100", lastVersion)

	// Test newer version
	message = []byte(`{"metadata":{"resourceVersion":"200"}}`)
	err = m.sendIfNewResourceVersion(message, conn, clientConn, &lastVersion)
	require.NoError(t, err)
	assert.Equal(t, "200", lastVersion)

	// Test invalid JSON
	message = []byte(`invalid json`)
	err = m.sendIfNewResourceVersion(message, conn, clientConn, &lastVersion)
	assert.Error(t, err)
	assert.Equal(t, "200", lastVersion) // Version should not change on error

	// Test missing resourceVersion
	message = []byte(`{"metadata":{}}`)
	err = m.sendIfNewResourceVersion(message, conn, clientConn, &lastVersion)
	require.NoError(t, err) // Should not error, but also not update version
	assert.Equal(t, "200", lastVersion)
}

func TestSendCompleteMessage_ClosedConnection(t *testing.T) {
	m := NewMultiplexer(kubeconfig.NewContextStore())
	clientConn, clientServer := createTestWebSocketConnection()

	defer clientServer.Close()

	conn := &Connection{
		ClusterID: "test-cluster",
		Path:      "/api/v1/pods",
		UserID:    "test-user",
		Query:     "watch=true",
	}

	// Test successful complete message
	err := m.sendCompleteMessage(conn, clientConn)
	require.NoError(t, err)

	// Verify the message
	_, message, err := clientConn.ReadMessage()
	require.NoError(t, err)

	var msg Message
	err = json.Unmarshal(message, &msg)
	require.NoError(t, err)

	assert.Equal(t, "COMPLETE", msg.Type)
	assert.Equal(t, conn.ClusterID, msg.ClusterID)
	assert.Equal(t, conn.Path, msg.Path)
	assert.Equal(t, conn.Query, msg.Query)
	assert.Equal(t, conn.UserID, msg.UserID)

	// Test with closed connection
	clientConn.Close()
	err = m.sendCompleteMessage(conn, clientConn)
	assert.NoError(t, err)
}

func TestSendCompleteMessage_ErrorConditions(t *testing.T) {
	tests := []struct {
		name          string
		setupConn     func(*Connection, *websocket.Conn)
		expectedError bool
	}{
		{
			name: "connection already marked as closed",
			setupConn: func(conn *Connection, _ *websocket.Conn) {
				conn.closed = true
			},
			expectedError: false,
		},
		{
			name: "normal closure",
			setupConn: func(_ *Connection, clientConn *websocket.Conn) {
				//nolint:errcheck
				clientConn.WriteMessage(websocket.CloseMessage,
					websocket.FormatCloseMessage(websocket.CloseNormalClosure, ""))
				clientConn.Close()
			},
			expectedError: false,
		},
		{
			name: "unexpected close error",
			setupConn: func(_ *Connection, clientConn *websocket.Conn) {
				//nolint:errcheck
				clientConn.WriteMessage(websocket.CloseMessage,
					websocket.FormatCloseMessage(websocket.CloseProtocolError, ""))
				clientConn.Close()
			},
			expectedError: false, // All errors return nil now
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			m := NewMultiplexer(kubeconfig.NewContextStore())
			clientConn, clientServer := createTestWebSocketConnection()
			defer clientServer.Close()

			conn := &Connection{
				ClusterID: "test-cluster",
				Path:      "/api/v1/pods",
				UserID:    "test-user",
				Query:     "watch=true",
			}

			tt.setupConn(conn, clientConn)
			err := m.sendCompleteMessage(conn, clientConn)

			if tt.expectedError {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func createMockKubeAPIServer() *httptest.Server {
	server := httptest.NewTLSServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		}
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		defer c.Close()

		// Echo messages back
		for {
			_, msg, err := c.ReadMessage()
			if err != nil {
				break
			}
			if err := c.WriteMessage(websocket.TextMessage, msg); err != nil {
				break
			}
		}
	}))

	// Configure the test client to accept the test server's TLS certificate
	server.Client().Transport.(*http.Transport).TLSClientConfig = &tls.Config{
		InsecureSkipVerify: true, //nolint:gosec
	}

	return server
}

func createTestWebSocketConnection() (*websocket.Conn, *httptest.Server) {
	server := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		upgrader := websocket.Upgrader{}
		c, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			return
		}

		defer c.Close()

		for {
			mt, message, err := c.ReadMessage()
			if err != nil {
				break
			}

			err = c.WriteMessage(mt, message)
			if err != nil {
				break
			}
		}
	}))

	wsURL := "ws" + strings.TrimPrefix(server.URL, "http")
	dialer := newTestDialer()

	ws, resp, err := dialer.Dial(wsURL, nil)
	if err != nil {
		panic(err)
	}

	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
	}

	return ws, server
}

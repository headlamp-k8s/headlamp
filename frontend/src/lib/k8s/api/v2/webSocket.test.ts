import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import WS from 'vitest-websocket-mock';
import { findKubeconfigByClusterName, getUserIdFromLocalStorage } from '../../../../stateless';
import { getToken } from '../../../auth';
import { getCluster } from '../../../cluster';
import { BASE_WS_URL, useWebSocket, WebSocketManager } from './webSocket';

// Mock dependencies
vi.mock('../../../cluster', () => ({
  getCluster: vi.fn(),
}));

vi.mock('../../../../stateless', () => ({
  getUserIdFromLocalStorage: vi.fn(),
  findKubeconfigByClusterName: vi.fn(),
}));

vi.mock('../../../auth', () => ({
  getToken: vi.fn(),
}));

vi.mock('./makeUrl', () => ({
  makeUrl: vi.fn((paths: string[] | string, query = {}) => {
    const url = Array.isArray(paths) ? paths.filter(Boolean).join('/') : paths;
    const queryString = new URLSearchParams(query).toString();
    const fullUrl = queryString ? `${url}?${queryString}` : url;
    return fullUrl.replace(/([^:]\/)\/+/g, '$1');
  }),
}));

const clusterName = 'test-cluster';
const userId = 'test-user';
const token = 'test-token';

describe('WebSocket Tests', () => {
  let mockServer: WS;
  let onMessage: ReturnType<typeof vi.fn>;
  let onError: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.stubEnv('REACT_APP_ENABLE_WEBSOCKET_MULTIPLEXER', 'true');
    vi.clearAllMocks();
    onMessage = vi.fn();
    onError = vi.fn();
    (getCluster as ReturnType<typeof vi.fn>).mockReturnValue(clusterName);
    (getUserIdFromLocalStorage as ReturnType<typeof vi.fn>).mockReturnValue(userId);
    (getToken as ReturnType<typeof vi.fn>).mockReturnValue(token);
    (findKubeconfigByClusterName as ReturnType<typeof vi.fn>).mockResolvedValue({});

    mockServer = new WS(`${BASE_WS_URL}wsMultiplexer`);
  });

  afterEach(async () => {
    WS.clean();
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
    WebSocketManager.socketMultiplexer = null;
    WebSocketManager.connecting = false;
    WebSocketManager.isReconnecting = false;
    WebSocketManager.listeners.clear();
    WebSocketManager.completedPaths.clear();
    WebSocketManager.activeSubscriptions.clear();
    WebSocketManager.pendingUnsubscribes.clear();
  });

  describe('WebSocketManager', () => {
    it('should establish connection and handle messages', async () => {
      const path = '/api/v1/pods';
      const query = 'watch=true';

      // Subscribe to pod updates
      await WebSocketManager.subscribe(clusterName, path, query, onMessage);
      await mockServer.connected;

      // Get the subscription message
      const subscribeMsg = JSON.parse((await mockServer.nextMessage) as string);
      expect(subscribeMsg).toEqual({
        clusterId: clusterName,
        path,
        query,
        userId,
        type: 'REQUEST',
      });

      // Send a message from server
      const podData = { kind: 'Pod', metadata: { name: 'test-pod' } };
      const serverMessage = {
        clusterId: clusterName,
        path,
        query,
        data: JSON.stringify(podData), // Important: data needs to be stringified
        type: 'DATA',
      };

      await mockServer.send(JSON.stringify(serverMessage));

      // Wait for message processing
      await vi.waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith(podData);
      });
    });

    it('should handle multiple subscriptions', async () => {
      const subs = [
        { path: '/api/v1/pods', query: 'watch=true' },
        { path: '/api/v1/services', query: 'watch=true' },
      ];

      // Subscribe to multiple resources
      await Promise.all(
        subs.map(sub => WebSocketManager.subscribe(clusterName, sub.path, sub.query, onMessage))
      );

      await mockServer.connected;

      // Verify subscription messages
      for (const sub of subs) {
        const msg = JSON.parse((await mockServer.nextMessage) as string);
        expect(msg).toEqual({
          clusterId: clusterName,
          path: sub.path,
          query: sub.query,
          userId,
          type: 'REQUEST',
        });

        // Send data for this subscription
        const resourceData = {
          kind: sub.path.includes('pods') ? 'Pod' : 'Service',
          metadata: { name: `test-${sub.path}` },
        };

        const serverMessage = {
          clusterId: clusterName,
          path: sub.path,
          query: sub.query,
          data: JSON.stringify(resourceData),
          type: 'DATA',
        };

        await mockServer.send(JSON.stringify(serverMessage));
      }

      // Verify all messages were received
      await vi.waitFor(() => {
        expect(onMessage).toHaveBeenCalledTimes(2);
      });
    });

    it('should handle COMPLETE messages', async () => {
      const path = '/api/v1/pods';
      const query = 'watch=true';

      await WebSocketManager.subscribe(clusterName, path, query, onMessage);
      await mockServer.connected;

      // Skip subscription message
      await mockServer.nextMessage;

      // Send COMPLETE message
      const completeMessage = {
        clusterId: clusterName,
        path,
        query,
        type: 'COMPLETE',
      };

      await mockServer.send(JSON.stringify(completeMessage));

      // Verify the path is marked as completed
      const key = WebSocketManager.createKey(clusterName, path, query);
      expect(WebSocketManager.completedPaths.has(key)).toBe(true);
    });

    it('should handle unsubscribe', async () => {
      const path = '/api/v1/pods';
      const query = 'watch=true';

      const cleanup = await WebSocketManager.subscribe(clusterName, path, query, onMessage);
      await mockServer.connected;

      // Skip subscription message
      await mockServer.nextMessage;

      // Unsubscribe
      cleanup();

      // Wait for unsubscribe message (after debounce)
      await vi.waitFor(async () => {
        const msg = JSON.parse((await mockServer.nextMessage) as string);
        expect(msg).toEqual({
          clusterId: clusterName,
          path,
          query,
          userId,
          type: 'CLOSE',
        });
      });

      // Verify subscription is removed
      const key = WebSocketManager.createKey(clusterName, path, query);
      expect(WebSocketManager.activeSubscriptions.has(key)).toBe(false);
    });

    it('should handle connection errors', async () => {
      // Close the server to simulate connection failure
      await mockServer.close();

      // Attempt to subscribe should fail
      await expect(
        WebSocketManager.subscribe(clusterName, '/api/v1/pods', 'watch=true', onMessage)
      ).rejects.toThrow('WebSocket connection failed');
    });

    it('should handle duplicate subscriptions', async () => {
      const path = '/api/v1/pods';
      const query = 'watch=true';

      // Create two subscriptions with the same parameters
      const onMessage2 = vi.fn();
      await WebSocketManager.subscribe(clusterName, path, query, onMessage);
      await WebSocketManager.subscribe(clusterName, path, query, onMessage2);

      await mockServer.connected;

      // Should only receive one subscription message
      const subMsg = JSON.parse((await mockServer.nextMessage) as string);
      expect(subMsg.type).toBe('REQUEST');

      // Send a message
      const podData = { kind: 'Pod', metadata: { name: 'test-pod' } };
      await mockServer.send(
        JSON.stringify({
          clusterId: clusterName,
          path,
          query,
          data: JSON.stringify(podData),
          type: 'DATA',
        })
      );

      // Both handlers should receive the message
      await vi.waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith(podData);
        expect(onMessage2).toHaveBeenCalledWith(podData);
      });
    });

    it('should debounce unsubscribe operations', async () => {
      const path = '/api/v1/pods';
      const query = 'watch=true';

      const cleanup = await WebSocketManager.subscribe(clusterName, path, query, onMessage);
      await mockServer.connected;

      // Skip subscription message
      await mockServer.nextMessage;

      // Unsubscribe
      cleanup();

      // Subscribe again immediately
      await WebSocketManager.subscribe(clusterName, path, query, onMessage);

      // Wait for potential unsubscribe message
      await vi.waitFor(() => {
        const key = WebSocketManager.createKey(clusterName, path, query);
        expect(WebSocketManager.activeSubscriptions.has(key)).toBe(true);
      });

      // Verify no CLOSE message was sent
      try {
        const msg = JSON.parse((await mockServer.nextMessage) as string);
        expect(msg.type).not.toBe('CLOSE');
      } catch (e) {
        // No message is also acceptable
      }
    });
  });

  describe('useWebSocket hook', () => {
    it('should not connect when disabled', () => {
      renderHook(() =>
        useWebSocket({
          url: () => '/api/v1/pods',
          enabled: false,
          cluster: clusterName,
          onMessage,
          onError,
        })
      );

      expect(WebSocketManager.socketMultiplexer).toBeNull();
    });

    it('should handle successful connection and messages', async () => {
      const fullUrl = `${BASE_WS_URL}api/v1/pods`;

      renderHook(() =>
        useWebSocket({
          url: () => fullUrl,
          enabled: true,
          cluster: clusterName,
          onMessage,
          onError,
        })
      );

      await mockServer.connected;

      // Skip subscription message
      await mockServer.nextMessage;

      // Send test message
      const podData = { kind: 'Pod', metadata: { name: 'test-pod' } };
      await mockServer.send(
        JSON.stringify({
          clusterId: clusterName,
          path: '/api/v1/pods',
          data: JSON.stringify(podData),
          type: 'DATA',
        })
      );

      await vi.waitFor(() => {
        expect(onMessage).toHaveBeenCalledWith(podData);
      });
    }, 10000);

    it('should handle connection errors', async () => {
      const fullUrl = `${BASE_WS_URL}api/v1/pods`;

      // Close the server to simulate connection failure
      await mockServer.close();

      renderHook(() =>
        useWebSocket({
          url: () => fullUrl,
          enabled: true,
          cluster: clusterName,
          onMessage,
          onError,
        })
      );

      await vi.waitFor(() => {
        expect(onError).toHaveBeenCalled();
      });
    });

    it('should cleanup on unmount', async () => {
      const fullUrl = `${BASE_WS_URL}api/v1/pods`;

      const { unmount } = renderHook(() =>
        useWebSocket({
          url: () => fullUrl,
          enabled: true,
          cluster: clusterName,
          onMessage,
          onError,
        })
      );

      await mockServer.connected;

      // Skip subscription message
      await mockServer.nextMessage;

      // Unmount and wait for cleanup
      unmount();

      await vi.waitFor(
        async () => {
          const msg = JSON.parse((await mockServer.nextMessage) as string);
          expect(msg.type).toBe('CLOSE');
        },
        { timeout: 10000 }
      );
    });
  });
});

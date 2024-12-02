import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { WebSocketManager } from './webSocket';

// Mock WebSocket
class MockWebSocket {
  onopen: (() => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: (() => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  readyState = 0; // WebSocket.CONNECTING
  send = vi.fn();

  constructor() {
    setTimeout(() => {
      this.readyState = 1; // WebSocket.OPEN
      this.onopen?.();
    }, 0);
  }

  close() {
    this.readyState = 3; // WebSocket.CLOSED
    this.onclose?.();
  }
}

// Mock localStorage
const mockGetUserId = vi.fn().mockReturnValue('test-user-id');
vi.mock('../../../helpers', () => ({
  getUserIdFromLocalStorage: () => mockGetUserId(),
}));

describe('WebSocketManager', () => {
  let originalWebSocket: typeof WebSocket;

  beforeEach(() => {
    // Save original WebSocket
    originalWebSocket = global.WebSocket;
    // Replace with mock
    (global as any).WebSocket = MockWebSocket;

    // Reset WebSocketManager state
    WebSocketManager.socketMultiplexer = null;
    WebSocketManager.connecting = false;
    WebSocketManager.isReconnecting = false;
    WebSocketManager.listeners.clear();
    WebSocketManager.completedPaths.clear();
    WebSocketManager.activeSubscriptions.clear();
    WebSocketManager.pendingUnsubscribes.clear();

    // Reset mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original WebSocket
    global.WebSocket = originalWebSocket;
  });

  describe('createKey', () => {
    it('should create a unique key from clusterId, path, and query', () => {
      const key = WebSocketManager.createKey('cluster1', '/api/v1/pods', 'watch=true');
      expect(key).toBe('cluster1:/api/v1/pods:watch=true');
    });
  });

  describe('connect', () => {
    it('should establish a WebSocket connection', async () => {
      const socket = await WebSocketManager.connect();
      expect(socket).toBeDefined();
      expect(WebSocketManager.socketMultiplexer).toBe(socket);
      expect(WebSocketManager.connecting).toBe(false);
    });

    it('should reuse existing connection if available', async () => {
      const socket1 = await WebSocketManager.connect();
      const socket2 = await WebSocketManager.connect();
      expect(socket1).toBe(socket2);
    });
  });

  describe('handleWebSocketMessage', () => {
    it('should handle COMPLETE messages', async () => {
      // First connect
      await WebSocketManager.connect();

      const key = WebSocketManager.createKey('cluster1', '/api/v1/pods', 'watch=true');

      // Simulate receiving a COMPLETE message
      const message = {
        clusterId: 'cluster1',
        path: '/api/v1/pods',
        query: 'watch=true',
        type: 'COMPLETE',
      };

      WebSocketManager.handleWebSocketMessage({ data: JSON.stringify(message) } as MessageEvent);

      expect(WebSocketManager.completedPaths.has(key)).toBe(true);
    });
  });
});

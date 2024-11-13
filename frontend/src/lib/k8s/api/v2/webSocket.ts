import { useEffect, useMemo } from 'react';
import { getUserIdFromLocalStorage } from '../../../../stateless';
import { KubeObjectInterface } from '../../KubeObject';
import { BASE_HTTP_URL } from './fetch';
import { KubeListUpdateEvent } from './KubeList';

// Constants for WebSocket connection
export const BASE_WS_URL = BASE_HTTP_URL.replace('http', 'ws');
/**
 * Multiplexer endpoint for WebSocket connections
 */
const MULTIPLEXER_ENDPOINT = 'wsMultiplexer';

// Message types for WebSocket communication
interface WebSocketMessage {
  /** Cluster ID */
  clusterId: string;
  /** API path */
  path: string;
  /** Query parameters */
  query: string;
  /** User ID */
  userId: string;
  /** Message type */
  type: 'REQUEST' | 'CLOSE' | 'COMPLETE';
}

/**
 * WebSocket manager to handle connections across the application.
 * Provides a singleton-like interface for managing WebSocket connections,
 * subscriptions, and message handling.
 */
export const WebSocketManager = {
  /** Current WebSocket connection instance */
  socket: null as WebSocket | null,

  /** Flag to track if a connection attempt is in progress */
  connecting: false,

  /** Map of message handlers for each subscription path
   * Key format: clusterId:path:query
   * Value: Set of callback functions for that subscription
   */
  listeners: new Map<string, Set<(data: any) => void>>(),

  /** Set of paths that have received a COMPLETE message
   * Used to prevent processing further messages for completed paths
   */
  completedPaths: new Set<string>(),

  /** Set of active WebSocket subscriptions to prevent duplicates
   * Keys are in format: clusterId:path:query
   */
  activeSubscriptions: new Set<string>(),

  /**
   * Creates a unique key for identifying WebSocket subscriptions
   * @param clusterId - The ID of the Kubernetes cluster
   * @param path - The API path being watched
   * @param query - Query parameters for the subscription
   * @returns A unique string key in format clusterId:path:query
   */
  createKey(clusterId: string, path: string, query: string): string {
    return `${clusterId}:${path}:${query}`;
  },

  /**
   * Establishes or returns an existing WebSocket connection.
   *
   * This implementation uses a polling approach to handle concurrent connection attempts.
   * While not ideal, it's a simple solution that works for most cases.
   *
   * Known limitations:
   * 1. Polls every 100ms which may not be optimal for performance
   * 2. No timeout - could theoretically run forever if connection never opens
   * 3. May miss state changes that happen between polls
   *
   * A more robust solution would use event listeners and Promise caching,
   * but that adds complexity and potential race conditions to handle.
   * The current polling approach, while not perfect, is simple and mostly reliable.
   *
   * @returns Promise resolving to WebSocket instance
   * @throws Error if connection fails
   */
  async connect(): Promise<WebSocket> {
    // Return existing connection if available
    if (this.socket?.readyState === WebSocket.OPEN) {
      return this.socket;
    }

    // Wait for existing connection attempt to complete
    if (this.connecting) {
      return new Promise(resolve => {
        const checkConnection = setInterval(() => {
          if (this.socket?.readyState === WebSocket.OPEN) {
            clearInterval(checkConnection);
            resolve(this.socket);
          }
        }, 100);
      });
    }

    this.connecting = true;
    const wsUrl = `${BASE_WS_URL}${MULTIPLEXER_ENDPOINT}`;

    return new Promise((resolve, reject) => {
      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        this.socket = socket;
        this.connecting = false;
        resolve(socket);
      };

      socket.onmessage = (event: MessageEvent) => {
        this.handleWebSocketMessage(event);
      };

      socket.onerror = event => {
        console.error('WebSocket error:', event);
        this.connecting = false;
        reject(new Error('WebSocket connection failed'));
      };

      socket.onclose = () => {
        this.handleWebSocketClose();
      };
    });
  },

  /**
   * Handles incoming WebSocket messages
   * Parses messages and distributes them to appropriate listeners
   * @param event - Raw WebSocket message event
   */
  handleWebSocketMessage(event: MessageEvent): void {
    try {
      const data = JSON.parse(event.data);
      if (!data.clusterId || !data.path) return;

      const key = this.createKey(data.clusterId, data.path, data.query || '');

      if (data.type === 'COMPLETE') {
        this.handleCompletionMessage(data, key);
        return;
      }

      if (this.completedPaths.has(key)) {
        return;
      }

      // Parse the update data
      let update;
      try {
        update = data.data ? JSON.parse(data.data) : data;
      } catch (err) {
        console.error('Failed to parse update data:', err);
        return;
      }

      // Only notify listeners if we have a valid update
      if (update && typeof update === 'object') {
        this.listeners.get(key)?.forEach(listener => listener(update));
      }
    } catch (err) {
      console.error('Failed to process WebSocket message:', err);
    }
  },

  /**
   * Handles COMPLETE type messages from the server
   * Marks paths as completed and sends close message
   * @param data - The complete message data
   * @param key - The subscription key
   */
  handleCompletionMessage(data: any, key: string): void {
    this.completedPaths.add(key);
    if (this.socket?.readyState === WebSocket.OPEN) {
      const closeMsg: WebSocketMessage = {
        clusterId: data.clusterId,
        path: data.path,
        query: data.query || '',
        userId: data.userId || '',
        type: 'CLOSE',
      };
      this.socket.send(JSON.stringify(closeMsg));
    }
  },

  /**
   * Handles WebSocket connection close events
   * Implements reconnection logic with delay
   */
  handleWebSocketClose(): void {
    console.log('WebSocket closed, attempting reconnect...');
    this.socket = null;
    this.connecting = false;
    if (this.listeners.size > 0) {
      setTimeout(() => this.connect(), 1000);
    }
  },

  /**
   * Subscribes to WebSocket updates for a specific path
   * Manages subscription lifecycle and prevents duplicates
   * @param clusterId - The ID of the Kubernetes cluster to watch
   * @param path - The API path to watch
   * @param query - Query parameters including resourceVersion
   * @param onMessage - Callback function to handle incoming messages
   * @returns Promise resolving to cleanup function
   */
  async subscribe(
    clusterId: string,
    path: string,
    query: string,
    onMessage: (data: any) => void
  ): Promise<() => void> {
    const key = this.createKey(clusterId, path, query);

    // Don't create duplicate subscriptions for the same path
    if (this.activeSubscriptions.has(key)) {
      if (!this.listeners.has(key)) {
        this.listeners.set(key, new Set());
      }
      this.listeners.get(key)!.add(onMessage);
      return () => this.handleUnsubscribe(key, onMessage, null, path, query);
    }

    this.activeSubscriptions.add(key);
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(onMessage);

    const socket = await this.connect();
    const userId = getUserIdFromLocalStorage();

    const message: WebSocketMessage = {
      clusterId,
      path,
      query,
      userId: userId || '',
      type: 'REQUEST',
    };

    socket.send(JSON.stringify(message));

    return () => {
      this.activeSubscriptions.delete(key);
      this.handleUnsubscribe(key, onMessage, userId, path, query);
    };
  },

  /**
   * Handles cleanup when unsubscribing from a WebSocket path
   * Removes listeners and closes connection if no more subscriptions
   * @param key - The unique subscription key
   * @param onMessage - The message handler to remove
   * @param userId - The user ID associated with the subscription
   * @param path - The API path being watched
   * @param query - Query parameters for the subscription
   */
  handleUnsubscribe(
    key: string,
    onMessage: (data: any) => void,
    userId: string | null,
    path: string,
    query: string
  ): void {
    const listeners = this.listeners.get(key);
    listeners?.delete(onMessage);

    if (listeners?.size === 0) {
      this.listeners.delete(key);
      this.completedPaths.delete(key);
      this.activeSubscriptions.delete(key);

      if (this.socket?.readyState === WebSocket.OPEN) {
        const [clusterId] = key.split(':');
        const closeMsg: WebSocketMessage = {
          clusterId,
          path,
          query,
          userId: userId || '',
          type: 'CLOSE',
        };
        this.socket.send(JSON.stringify(closeMsg));
      }
    }

    if (this.listeners.size === 0) {
      this.socket?.close();
      this.socket = null;
    }
  },
};

/**
 * React hook for WebSocket subscription to Kubernetes resources
 * @param options - Configuration options for the WebSocket connection
 * @param options.url - Function that returns the WebSocket URL to connect to
 * @param options.enabled - Whether the WebSocket connection should be active
 * @param options.cluster - The Kubernetes cluster ID to watch
 * @param options.onMessage - Callback function to handle incoming Kubernetes events
 * @param options.onError - Callback function to handle connection errors
 *
 * @example
 * useWebSocket<Pod>({
 *   url: () => '/api/v1/pods?watch=1',
 *   enabled: true,
 *   cluster: 'my-cluster',
 *   onMessage: (event) => console.log('Pod update:', event),
 *   onError: (error) => console.error('WebSocket error:', error),
 * });
 */
export function useWebSocket<T extends KubeObjectInterface>({
  url: createUrl,
  enabled = true,
  cluster = '',
  onMessage,
  onError,
}: {
  /** Function that returns the WebSocket URL to connect to */
  url: () => string;
  /** Whether the WebSocket connection should be active */
  enabled?: boolean;
  /** The Kubernetes cluster ID to watch */
  cluster?: string;
  /** Callback function to handle incoming Kubernetes events */
  onMessage: (data: KubeListUpdateEvent<T>) => void;
  /** Callback function to handle connection errors */
  onError?: (error: Error) => void;
}) {
  /**
   * Memoized URL to prevent unnecessary reconnections
   */
  const url = useMemo(() => (enabled ? createUrl() : ''), [enabled, createUrl]);

  useEffect(() => {
    if (!enabled || !url) return;

    const parsedUrl = new URL(url, BASE_WS_URL);
    let cleanup: (() => void) | undefined;

    WebSocketManager.subscribe(
      cluster,
      parsedUrl.pathname,
      parsedUrl.search.slice(1),
      (update: any) => {
        try {
          if (isKubeListUpdateEvent<T>(update)) {
            onMessage(update);
          }
        } catch (err) {
          console.error('Failed to process WebSocket message:', err);
          onError?.(err as Error);
        }
      }
    ).then(
      unsubscribe => {
        cleanup = unsubscribe;
      },
      error => {
        console.error('WebSocket subscription failed:', error);
        onError?.(error);
      }
    );

    // Cleanup function to unsubscribe when the component unmounts
    // or when any of the dependencies change
    return () => {
      cleanup?.();
    };
  }, [enabled, url, cluster, onMessage, onError]);
}

/**
 * Type guard to check if a message is a valid Kubernetes list update event
 * @param data - The data to check
 * @returns True if the data is a valid KubeListUpdateEvent
 */
function isKubeListUpdateEvent<T extends KubeObjectInterface>(
  data: any
): data is KubeListUpdateEvent<T> {
  return (
    data &&
    typeof data === 'object' &&
    'type' in data &&
    'object' in data &&
    ['ADDED', 'MODIFIED', 'DELETED'].includes(data.type)
  );
}

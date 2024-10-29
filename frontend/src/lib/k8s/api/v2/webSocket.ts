import { useEffect, useMemo } from 'react';
import { findKubeconfigByClusterName, getUserIdFromLocalStorage } from '../../../../stateless';
import { getToken } from '../../../auth';
import { getCluster } from '../../../cluster';
import { BASE_HTTP_URL } from './fetch';
import { makeUrl } from './makeUrl';

const BASE_WS_URL = BASE_HTTP_URL.replace('http', 'ws');

/**
 * Create new WebSocket connection to the backend
 *
 * @param url - WebSocket URL
 * @param options - Connection options
 *
 * @returns WebSocket connection
 */
export async function openWebSocket<T>(
  url: string,
  {
    protocols: moreProtocols = [],
    type = 'binary',
    cluster = getCluster() ?? '',
    onMessage,
  }: {
    /**
     * Any additional protocols to include in WebSocket connection
     */
    protocols?: string | string[];
    /**
     *
     */
    type: 'json' | 'binary';
    /**
     * Cluster name
     */
    cluster?: string;
    /**
     * Message callback
     */
    onMessage: (data: T) => void;
  }
) {
  const path = [url];
  const protocols = ['base64.binary.k8s.io', ...(moreProtocols ?? [])];

  const token = getToken(cluster);
  if (token) {
    const encodedToken = btoa(token).replace(/=/g, '');
    protocols.push(`base64url.bearer.authorization.k8s.io.${encodedToken}`);
  }

  if (cluster) {
    path.unshift('clusters', cluster);

    try {
      const kubeconfig = await findKubeconfigByClusterName(cluster);

      if (kubeconfig !== null) {
        const userID = getUserIdFromLocalStorage();
        protocols.push(`base64url.headlamp.authorization.k8s.io.${userID}`);
      }
    } catch (error) {
      console.error('Error while finding kubeconfig:', error);
    }
  }

  const socket = new WebSocket(makeUrl([BASE_WS_URL, ...path], {}), protocols);
  socket.binaryType = 'arraybuffer';
  socket.addEventListener('message', (body: MessageEvent) => {
    const data = type === 'json' ? JSON.parse(body.data) : body.data;
    onMessage(data);
  });
  socket.addEventListener('error', error => {
    console.error('WebSocket error:', error);
  });

  return socket;
}

// Global state for useWebSocket hook
// Keeps track of open WebSocket connections and active listeners
const sockets = new Map<string, WebSocket | 'pending'>();
const listeners = new Map<string, Array<(update: any) => void>>();

/**
 * Creates or joins existing WebSocket connection
 *
 * @param url - endpoint URL
 * @param options - WebSocket options
 */
export function useWebSocket<T>({
  url: createUrl,
  enabled = true,
  protocols,
  type = 'json',
  cluster,
  onMessage,
}: {
  url: () => string;
  enabled?: boolean;
  /**
   * Any additional protocols to include in WebSocket connection
   */
  protocols?: string | string[];
  /**
   * Type of websocket data
   */
  type?: 'json' | 'binary';
  /**
   * Cluster name
   */
  cluster?: string;
  /**
   * Message callback
   */
  onMessage: (data: T) => void;
}) {
  const url = useMemo(() => (enabled ? createUrl() : ''), [enabled]);
  const connections = useMemo(() => [{ cluster: cluster ?? '', url, onMessage }], [cluster, url]);

  return useWebSockets({
    connections,
    protocols,
    type,
  });
}

export type WebSocketConnectionRequest<T> = {
  cluster: string;
  url: string;
  onMessage: (data: T) => void;
};

/**
 * Creates or joins mutiple existing WebSocket connections
 *
 * @param url - endpoint URL
 * @param options - WebSocket options
 */
export function useWebSockets<T>({
  connections,
  enabled = true,
  protocols,
  type = 'json',
}: {
  enabled?: boolean;
  /** Make sure that connections value is stable between renders */
  connections: Array<WebSocketConnectionRequest<T>>;
  /**
   * Any additional protocols to include in WebSocket connection
   * make sure that the value is stable between renders
   */
  protocols?: string | string[];
  /**
   * Type of websocket data
   */
  type?: 'json' | 'binary';
}) {
  useEffect(() => {
    if (!enabled) return;

    let isCurrent = true;

    /** Open a connection to websocket */
    function connect({ cluster, url, onMessage }: WebSocketConnectionRequest<T>) {
      const connectionKey = cluster + url;

      if (!sockets.has(connectionKey)) {
        // Add new listener for this URL
        listeners.set(connectionKey, [...(listeners.get(connectionKey) ?? []), onMessage]);

        // Mark socket as pending, so we don't open more than one
        sockets.set(connectionKey, 'pending');

        let ws: WebSocket | undefined;
        openWebSocket(url, { protocols, type, cluster, onMessage })
          .then(socket => {
            ws = socket;

            // Hook was unmounted while it was connecting to WebSocket
            // so we close the socket and clean up
            if (!isCurrent) {
              ws.close();
              sockets.delete(connectionKey);
              return;
            }

            sockets.set(connectionKey, ws);
          })
          .catch(err => {
            console.error(err);
          });
      }

      return () => {
        const connectionKey = cluster + url;

        // Clean up the listener
        const newListeners = listeners.get(connectionKey)?.filter(it => it !== onMessage) ?? [];
        listeners.set(connectionKey, newListeners);

        // No one is listening to the connection
        // so we can close it
        if (newListeners.length === 0) {
          const maybeExisting = sockets.get(connectionKey);
          if (maybeExisting) {
            if (maybeExisting !== 'pending') {
              maybeExisting.close();
            }
            sockets.delete(connectionKey);
          }
        }
      };
    }

    const disconnectCallbacks = connections.map(endpoint => connect(endpoint));

    return () => {
      isCurrent = false;
      disconnectCallbacks.forEach(fn => fn());
    };
  }, [enabled, type, connections, protocols]);
}

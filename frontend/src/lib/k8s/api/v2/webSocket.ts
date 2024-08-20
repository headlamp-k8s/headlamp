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
   *
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

  useEffect(() => {
    if (!enabled) return;

    // Add new listener for this URL
    listeners.set(url, [...(listeners.get(url) ?? []), onMessage]);

    let isCurrent = true;
    async function init() {
      // Mark socket as pending, so we don't open more than one
      sockets.set(url, 'pending');
      const ws = await openWebSocket(url, { protocols, type, cluster, onMessage });

      // Hook was unmounted while it was connecting to WebSocket
      // so we close the socket and clean up
      if (!isCurrent) {
        ws.close();
        sockets.delete(url);
        return;
      }

      sockets.set(url, ws);
    }

    // Check if we already have a connection (even if still pending)
    if (!sockets.has(url)) {
      init();
    }

    return () => {
      isCurrent = false;

      // Clean up the listener
      const newListeners = listeners.get(url)?.filter(it => it !== onMessage) ?? [];
      listeners.set(url, newListeners);

      // No one is listening to the connection
      // so we can close it
      if (newListeners.length === 0) {
        const maybeExisting = sockets.get(url);
        if (maybeExisting) {
          if (maybeExisting !== 'pending') {
            maybeExisting.close();
          }
          sockets.delete(url);
        }
      }
    };
  }, [enabled, url, protocols, type, cluster]);
}

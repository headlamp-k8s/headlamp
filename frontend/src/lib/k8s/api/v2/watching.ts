import { findKubeconfigByClusterName, getUserIdFromLocalStorage } from '../../../../stateless';
import { getToken } from '../../../auth';
import { getCluster } from '../../../cluster';
import { KubeObjectClass, KubeObjectInterface } from '../../cluster';
import { BASE_HTTP_URL } from './fetch';
import { KubeList, KubeListUpdateEvent } from './KubeList';
import { KubeObjectEndpoint } from './KubeObjectEndpoint';
import { makeUrl } from './utils';

const BASE_WS_URL = BASE_HTTP_URL.replace('http', 'ws');

export async function openWebSocket<T>(
  url: string,
  {
    protocols: moreProtocols = [],
    type = 'binary',
    cluster = getCluster() ?? '',
    onMessage,
  }: {
    protocols?: string | string[];
    type: 'json' | 'binary';
    cluster?: string;
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

export async function watchList<T extends KubeObjectInterface>({
  endpoint,
  resourceVersion,
  cluster = getCluster() ?? '',
  queryParams,
  onListUpdate,
  itemClass,
}: {
  endpoint: KubeObjectEndpoint;
  resourceVersion: string;
  cluster?: string;
  queryParams?: any;
  onListUpdate: (update: (oldList: KubeList<T>) => KubeList<T>) => void;
  itemClass: KubeObjectClass;
}) {
  const watchUrl = makeUrl([KubeObjectEndpoint.toUrl(endpoint)], {
    ...queryParams,
    watch: '1',
    resourceVersion,
  });

  function update(event: KubeListUpdateEvent<T>) {
    onListUpdate(list => KubeList.applyUpdate(list, event, itemClass));
  }

  const socket = await openWebSocket<KubeListUpdateEvent<T>>(watchUrl, {
    type: 'json',
    cluster,
    onMessage: update,
  });

  return socket;
}

export async function watchObject<T extends KubeObjectInterface>({
  endpoint,
  name,
  cluster = getCluster() ?? '',
  onObject,
  itemClass,
}: {
  endpoint: KubeObjectEndpoint;
  name: string;
  cluster?: string;
  onObject: (newObject: T) => void;
  itemClass: KubeObjectClass;
}) {
  const watchUrl = makeUrl([KubeObjectEndpoint.toUrl(endpoint)], {
    watch: '1',
    fieldSelector: `metadata.name=${name}`,
  });

  function update(event: KubeListUpdateEvent<T>) {
    if (event.object) {
      onObject(new itemClass(event.object) as T);
    }
  }

  const socket = await openWebSocket<KubeListUpdateEvent<T>>(watchUrl, {
    type: 'json',
    cluster,
    onMessage: update,
  });

  return socket;
}

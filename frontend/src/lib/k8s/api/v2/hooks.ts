import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef } from 'react';
import { getCluster } from '../../../cluster';
import { ApiError, QueryParameters } from '../../apiProxy';
import { KubeObjectClass, KubeObjectInterface } from '../../cluster';
import { clusterFetch } from './fetch';
import { KubeList } from './KubeList';
import { KubeObjectEndpoint } from './KubeObjectEndpoint';
import { makeUrl } from './utils';
import { watchList, watchObject } from './watching';

/**
 * Returns a single KubeObject.
 */
export function useKubeObject<T extends KubeObjectClass>({
  kubeObjectClass,
  namespace,
  name,
  cluster: maybeCluster,
}: {
  kubeObjectClass: T;
  namespace?: string;
  name: string;
  cluster?: string;
}) {
  type Instance = InstanceType<T>;
  const endpoint = useEndpoints(kubeObjectClass.apiEndpoint.apiInfo);
  const cluster = maybeCluster ?? getCluster() ?? 'default';

  const queryKey = useMemo(
    () => ['object', cluster, endpoint, namespace, name],
    [endpoint, namespace, name]
  );

  const socketRef = useRef<Promise<WebSocket> | undefined>();
  function startWatching() {
    if (socketRef.current || !endpoint) return;

    socketRef.current = watchObject({
      endpoint,
      name,
      onObject: obj => client.setQueryData(queryKey, obj),
      itemClass: kubeObjectClass,
    });
  }

  useEffect(() => {
    if (!endpoint) return;
    const maybeData = client.getQueryData<KubeList<Instance>>(queryKey);
    if (maybeData) {
      startWatching();
    }

    return () => {
      socketRef.current?.then(socket => socket.close());
    };
  }, [endpoint]);

  const client = useQueryClient();
  const query = useQuery<Instance | null, ApiError>({
    enabled: !!endpoint,
    placeholderData: null,
    staleTime: 5000,
    queryKey,
    queryFn: async () => {
      if (!endpoint) return;
      const url = makeUrl([KubeObjectEndpoint.toUrl(endpoint, namespace), name]);
      const obj: KubeObjectInterface = await clusterFetch(url, {
        cluster,
      }).then(it => it.json());
      startWatching();
      return new kubeObjectClass(obj);
    },
  });

  return query;
}

/**
 * Test different endpoints to see which one is working.
 */
const getWorkingEndpoint = async (endpoints: KubeObjectEndpoint[]) => {
  const promises = endpoints.map(endpoint => {
    return clusterFetch(KubeObjectEndpoint.toUrl(endpoint), {
      method: 'GET',
      cluster: getCluster() ?? '',
    }).then(it => {
      if (!it.ok) {
        // reject
        throw new Error('error');
      }
      return endpoint;
    });
  });
  return Promise.any(promises);
};

const useEndpoints = (endpoints: KubeObjectEndpoint[]) => {
  const { data: endpoint } = useQuery({
    enabled: endpoints.length > 1,
    queryKey: ['endpoints', endpoints],
    queryFn: () => getWorkingEndpoint(endpoints),
  });

  if (endpoints.length === 1) return endpoints[0];

  return endpoint;
};

export function useKubeObjectList<T extends KubeObjectClass>({
  kubeObjectClass,
  namespace,
  cluster: maybeCluster,
  queryParams,
}: {
  kubeObjectClass: T;
  namespace?: string;
  cluster?: string;
  queryParams: QueryParameters;
}) {
  const endpoint = useEndpoints(kubeObjectClass.apiEndpoint.apiInfo);

  const cleanedUpQueryParams = Object.fromEntries(
    Object.entries(queryParams ?? {}).filter(([, value]) => value !== undefined && value !== '')
  );

  const cluster = maybeCluster ?? getCluster() ?? 'default';

  const queryKey = useMemo(
    () => ['list', cluster, endpoint, namespace, cleanedUpQueryParams],
    [endpoint, namespace, cleanedUpQueryParams]
  );

  const socketRef = useRef<Promise<WebSocket> | undefined>();
  function startWatching(resourceVersion: string) {
    if (socketRef.current || !endpoint) return;

    socketRef.current = watchList({
      endpoint,
      resourceVersion,
      cluster,
      queryParams: cleanedUpQueryParams,
      itemClass: kubeObjectClass,
      onListUpdate: updater => {
        client.setQueryData(queryKey, (oldList: any) => {
          const newList = updater(oldList);
          return newList;
        });
      },
    });
  }

  const client = useQueryClient();
  const query = useQuery<KubeList<any> | null | undefined, ApiError>({
    enabled: !!endpoint,
    placeholderData: null,
    queryKey,
    queryFn: async () => {
      if (!endpoint) return;
      const list: KubeList<any> = await clusterFetch(
        makeUrl([KubeObjectEndpoint.toUrl(endpoint!, namespace)], cleanedUpQueryParams),
        {
          cluster,
        }
      ).then(it => it.json());
      list.items = list.items.map(
        item => new kubeObjectClass({ ...item, kind: list.kind.replace('List', '') })
      );

      // start watching if we haven't yet
      startWatching(list.metadata.resourceVersion);
      return list;
    },
  });

  useEffect(() => {
    if (!endpoint) return;
    const maybeData = client.getQueryData<KubeList<any>>(queryKey);
    if (maybeData) {
      startWatching(maybeData.metadata.resourceVersion);
    }

    return () => {
      socketRef.current?.then(socket => socket.close());
    };
  }, [endpoint]);

  return { items: query.data?.items ?? null, ...query };
}

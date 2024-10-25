import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getCluster } from '../../../cluster';
import { ApiError, QueryParameters } from '../../apiProxy';
import { KubeObject, KubeObjectInterface } from '../../KubeObject';
import { clusterFetch } from './fetch';
import { KubeList, KubeListUpdateEvent } from './KubeList';
import { KubeObjectEndpoint } from './KubeObjectEndpoint';
import { makeUrl } from './makeUrl';
import { useWebSocket } from './webSocket';

export type QueryStatus = 'pending' | 'success' | 'error';

export interface QueryResponse<DataType, ErrorType> {
  /**
   * The last successfully resolved data for the query.
   */
  data: DataType | null;
  /**
   * The error object for the query, if an error was thrown.
   * - Defaults to `null`.
   */
  error: ErrorType | null;
  /**
   * A derived boolean from the `status` variable, provided for convenience.
   * - `true` if the query attempt resulted in an error.
   */
  isError: boolean;
  /**
   * Is `true` whenever the first fetch for a query is in-flight.
   */
  isLoading: boolean;
  /**
   * Is `true` whenever the query is executing, which includes initial fetch as well as background refetch.
   */
  isFetching: boolean;
  /**
   * A derived boolean from the `status` variable, provided for convenience.
   * - `true` if the query has received a response with no errors and is ready to display its data.
   */
  isSuccess: boolean;
  /**
   * The status of the query.
   * - Will be:
   *   - `pending` if there's no cached data and no query attempt was finished yet.
   *   - `error` if the query attempt resulted in an error.
   *   - `success` if the query has received a response with no errors and is ready to display its data.
   */
  status: QueryStatus;
}

/**
 * Query response containing KubeList with added items field for convenience
 */
export interface QueryListResponse<DataType, ItemType, ErrorType>
  extends QueryResponse<DataType, ErrorType> {
  items: Array<ItemType> | null;
  /**
   * Results from individual clusters. Keyed by cluster name.
   */
  clusterResults?: Record<string, QueryListResponse<DataType, ItemType, ErrorType>>;
  /**
   * Errors from individual clusters. Keyed by cluster name.
   */
  clusterErrors?: Record<string, ApiError | null> | null;
}

/**
 * Returns a single KubeObject.
 */
export function useKubeObject<K extends KubeObject>({
  kubeObjectClass,
  namespace,
  name,
  cluster: maybeCluster,
  queryParams,
}: {
  /** Class to instantiate the object with */
  kubeObjectClass: (new (...args: any) => K) & typeof KubeObject<any>;
  /** Object namespace */
  namespace?: string;
  /** Object name */
  name: string;
  /** Cluster name */
  cluster?: string;
  queryParams?: QueryParameters;
}): [K | null, ApiError | null] & QueryResponse<K, ApiError> {
  type Instance = K;
  const cluster = maybeCluster ?? getCluster() ?? '';
  const endpoint = useEndpoints(kubeObjectClass.apiEndpoint.apiInfo, cluster);

  const cleanedUpQueryParams = Object.fromEntries(
    Object.entries(queryParams ?? {}).filter(([, value]) => value !== undefined && value !== '')
  );

  const queryKey = useMemo(
    () => ['object', cluster, endpoint, namespace, name, cleanedUpQueryParams],
    [endpoint, namespace, name]
  );

  const client = useQueryClient();
  const query = useQuery<Instance | null, ApiError>({
    enabled: !!endpoint,
    placeholderData: null,
    staleTime: 5000,
    queryKey,
    queryFn: async () => {
      const url = makeUrl(
        [KubeObjectEndpoint.toUrl(endpoint!, namespace), name],
        cleanedUpQueryParams
      );
      const obj: KubeObjectInterface = await clusterFetch(url, {
        cluster,
      }).then(it => it.json());
      return new kubeObjectClass(obj) as Instance;
    },
  });

  const data: Instance | null = query.error ? null : query.data ?? null;

  useWebSocket<KubeListUpdateEvent<Instance>>({
    url: () =>
      makeUrl([KubeObjectEndpoint.toUrl(endpoint!)], {
        ...cleanedUpQueryParams,
        watch: 1,
        fieldSelector: `metadata.name=${name}`,
      }),
    enabled: !!endpoint && !!data,
    cluster,
    onMessage(update) {
      if (update.type !== 'ADDED' && update.object) {
        client.setQueryData(queryKey, new kubeObjectClass(update.object));
      }
    },
  });

  // @ts-ignore
  return {
    data,
    error: query.error,
    isError: query.isError,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    status: query.status,
    *[Symbol.iterator](): ArrayIterator<ApiError | K | null> {
      yield data;
      yield query.error;
    },
  };
}

/**
 * Test different endpoints to see which one is working.
 *
 * @params endpoints - List of possible endpoints
 * @returns Endpoint that works
 *
 * @throws Error
 * When no endpoints are working
 */
const getWorkingEndpoint = async (endpoints: KubeObjectEndpoint[], cluster: string) => {
  const promises = endpoints.map(endpoint => {
    return clusterFetch(KubeObjectEndpoint.toUrl(endpoint), {
      method: 'GET',
      cluster: cluster ?? getCluster() ?? '',
    }).then(it => {
      if (!it.ok) {
        throw new Error('error');
      }
      return endpoint;
    });
  });
  return Promise.any(promises);
};

/**
 * Checks and returns an endpoint that works from the list
 *
 * @params endpoints - List of possible endpoints
 */
const useEndpoints = (endpoints: KubeObjectEndpoint[], cluster: string) => {
  const { data: endpoint } = useQuery({
    enabled: endpoints.length > 1,
    queryKey: ['endpoints', endpoints],
    queryFn: () =>
      getWorkingEndpoint(endpoints, cluster)
        .then(endpoints => endpoints)
        .catch(() => null),
  });

  if (endpoints.length === 1) return endpoints[0];

  return endpoint;
};

/**
 * Returns a list of Kubernetes objects and watches for changes
 *
 * @private please use useKubeObjectList.
 */
function _useKubeObjectList<K extends KubeObject>({
  kubeObjectClass,
  namespace,
  cluster: maybeCluster,
  queryParams,
}: {
  /** Class to instantiate the object with */
  kubeObjectClass: (new (...args: any) => K) & typeof KubeObject<any>;
  /** Object list namespace */
  namespace?: string;
  /** Object list cluster */
  cluster?: string;
  queryParams?: QueryParameters;
}): [Array<K> | null, ApiError | null] & QueryListResponse<KubeList<K>, K, ApiError> {
  const cluster = maybeCluster ?? getCluster() ?? '';
  const endpoint = useEndpoints(kubeObjectClass.apiEndpoint.apiInfo, cluster);

  const cleanedUpQueryParams = Object.fromEntries(
    Object.entries(queryParams ?? {}).filter(([, value]) => value !== undefined && value !== '')
  );

  const queryKey = useMemo(
    () => ['list', cluster, endpoint, namespace, cleanedUpQueryParams],
    [endpoint, namespace, cleanedUpQueryParams]
  );

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
      list.items = list.items.map(item => {
        const itm = new kubeObjectClass({ ...item, kind: list.kind.replace('List', '') });
        itm.cluster = cluster;
        return itm;
      });

      return list;
    },
  });

  const items: Array<K> | null = query.error ? null : query.data?.items ?? null;
  const data: KubeList<K> | null = query.error ? null : query.data ?? null;

  useWebSocket<KubeListUpdateEvent<K>>({
    url: () =>
      makeUrl([KubeObjectEndpoint.toUrl(endpoint!)], {
        ...cleanedUpQueryParams,
        watch: 1,
        resourceVersion: data!.metadata.resourceVersion,
      }),
    cluster,
    enabled: !!endpoint && !!data,
    onMessage(update) {
      client.setQueryData(queryKey, (oldList: any) => {
        const newList = KubeList.applyUpdate(oldList, update, kubeObjectClass);
        return newList;
      });
    },
  });

  // @ts-ignore
  return {
    items,
    data,
    error: query.error,
    isError: query.isError,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    status: query.status,
    *[Symbol.iterator](): ArrayIterator<ApiError | K[] | null> {
      yield items;
      yield query.error;
    },
  };
}

/**
 * Returns a combined list of Kubernetes objects and watches for changes from the clusters given.
 */
export function useKubeObjectList<K extends KubeObject>({
  kubeObjectClass,
  namespace,
  cluster,
  clusters,
  queryParams,
}: {
  /** Class to instantiate the object with */
  kubeObjectClass: (new (...args: any) => K) & typeof KubeObject<any>;
  /** Object list namespace */
  namespace?: string;
  cluster?: string;
  /** Object list clusters */
  clusters?: string[];
  queryParams?: QueryParameters;
}): [Array<K> | null, ApiError | null] & QueryListResponse<KubeList<K>, K, ApiError> {
  if (clusters && clusters.length > 0) {
    return _useKubeObjectLists({
      kubeObjectClass,
      namespace,
      clusters: clusters,
      queryParams,
    });
  } else {
    return _useKubeObjectList({
      kubeObjectClass,
      namespace,
      cluster: cluster,
      queryParams,
    });
  }
}

/**
 * Returns a combined list of Kubernetes objects and watches for changes from the clusters given.
 *
 * @private please use useKubeObjectList
 */
function _useKubeObjectLists<K extends KubeObject>({
  kubeObjectClass,
  namespace,
  clusters,
  queryParams,
}: {
  /** Class to instantiate the object with */
  kubeObjectClass: (new (...args: any) => K) & typeof KubeObject<any>;
  /** Object list namespace */
  namespace?: string;
  /** Object list clusters */
  clusters: string[];
  queryParams?: QueryParameters;
}): [Array<K> | null, ApiError | null] & QueryListResponse<KubeList<K>, K, ApiError> {
  const clusterResults: Record<string, ReturnType<typeof useKubeObjectList<K>>> = {};

  for (const cluster of clusters) {
    clusterResults[cluster] = _useKubeObjectList({
      kubeObjectClass,
      namespace,
      cluster: cluster || undefined,
      queryParams,
    });
  }

  let items = null;
  for (const cluster of clusters) {
    if (items === null) {
      items = clusterResults[cluster].items;
    } else {
      items = items.concat(clusterResults[cluster].items!);
    }
  }

  // data makes no sense really for multiple clusters, but useful for single cluster?
  const data =
    clusters.map(cluster => clusterResults[cluster].data).find(it => it !== null) ?? null;
  const error =
    clusters.map(cluster => clusterResults[cluster].error).find(it => it !== null) ?? null;
  const isError = clusters.some(cluster => clusterResults[cluster].isError);
  const isLoading = clusters.some(cluster => clusterResults[cluster].isLoading);
  const isFetching = clusters.some(cluster => clusterResults[cluster].isFetching);
  const isSuccess = clusters.every(cluster => clusterResults[cluster].isSuccess);
  // status makes no sense really for multiple clusters, but maybe useful for single cluster?
  const status =
    clusters.map(cluster => clusterResults[cluster].status).find(it => it !== null) ?? 'pending';

  let clusterErrors: Record<string, ApiError | null> | null = {};
  clusters.forEach(cluster => {
    if (clusterErrors && clusterResults[cluster]?.error !== null) {
      clusterErrors[cluster] = clusterResults[cluster].error;
    }
  });
  if (Object.keys(clusterErrors).length === 0) {
    clusterErrors = null;
  }

  // @ts-ignore
  return {
    items,
    data,
    error,
    isError,
    isLoading,
    isFetching,
    isSuccess,
    status,
    *[Symbol.iterator](): ArrayIterator<ApiError | K[] | null> {
      yield items;
      yield error;
    },
    clusterResults,
    clusterErrors,
  };
}

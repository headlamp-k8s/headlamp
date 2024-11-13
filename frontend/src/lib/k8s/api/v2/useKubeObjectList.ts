import { QueryObserverOptions, useQueries, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useRef, useState } from 'react';
import { KubeObject, KubeObjectClass } from '../../KubeObject';
import { ApiError } from '../v1/clusterRequests';
import { QueryParameters } from '../v1/queryParameters';
import { clusterFetch } from './fetch';
import { QueryListResponse, useEndpoints } from './hooks';
import { KubeList } from './KubeList';
import { KubeObjectEndpoint } from './KubeObjectEndpoint';
import { makeUrl } from './makeUrl';
import { BASE_WS_URL, WebSocketManager } from './webSocket';

/**
 * Object representing a List of Kube object
 * with information about which cluster and namespace it came from
 */
export interface ListResponse<K extends KubeObject> {
  /** KubeList with items */
  list: KubeList<K>;
  /** Cluster of the list */
  cluster: string;
  /** If the list only has items from one namespace */
  namespace?: string;
}

/**
 * Error thrown when listing Kube objects
 * Contains information about the cluster and namespace
 */
class ListError extends Error {
  constructor(public message: any, public cluster: string, public namespace?: string) {
    super(message);
  }
}

/**
 * Query to list Kube objects from a cluster and namespace(optional)
 *
 * @param kubeObjectClass - Class to instantiate the object with
 * @param endpoint - API endpoint
 * @param namespace - namespace to list objects from(optional)
 * @param cluster - cluster name
 * @param queryParams - query parameters
 * @returns query options for getting a single list of kube resources
 */
export function kubeObjectListQuery<K extends KubeObject>(
  kubeObjectClass: KubeObjectClass,
  endpoint: KubeObjectEndpoint,
  namespace: string | undefined,
  cluster: string,
  queryParams: QueryParameters
): QueryObserverOptions<ListResponse<K> | undefined | null, ListError> {
  return {
    placeholderData: null,
    queryKey: [
      'kubeObject',
      'list',
      kubeObjectClass.apiVersion,
      kubeObjectClass.apiName,
      cluster,
      namespace ?? '',
      queryParams,
    ],
    queryFn: async () => {
      // If no valid endpoint is passed, don't make the request
      if (!endpoint) return;

      try {
        const list: KubeList<any> = await clusterFetch(
          makeUrl([KubeObjectEndpoint.toUrl(endpoint!, namespace)], queryParams),
          {
            cluster,
          }
        ).then(it => it.json());
        list.items = list.items.map(item => {
          const itm = new kubeObjectClass({
            ...item,
            kind: list.kind.replace('List', ''),
            apiVersion: list.apiVersion,
          });
          itm.cluster = cluster;
          return itm;
        });

        const response: ListResponse<K> = {
          list: list as KubeList<K>,
          cluster,
          namespace,
        };

        return response;
      } catch (e) {
        // Rethrow error with cluster and namespace information
        throw new ListError(e, cluster, namespace);
      }
    },
  };
}

/**
 * Accepts a list of lists to watch.
 * Upon receiving update it will modify query data for list query
 */
export function useWatchKubeObjectLists<K extends KubeObject>({
  kubeObjectClass,
  endpoint,
  lists,
  queryParams,
}: {
  /** KubeObject class of the watched resource list */
  kubeObjectClass: (new (...args: any) => K) & typeof KubeObject<any>;
  /** Query parameters for the WebSocket connection URL */
  queryParams?: QueryParameters;
  /** Kube resource API endpoint information */
  endpoint?: KubeObjectEndpoint | null;
  /** Which clusters and namespaces to watch */
  lists: Array<{ cluster: string; namespace?: string; resourceVersion: string }>;
}) {
  const client = useQueryClient();
  const latestResourceVersions = useRef<Record<string, string>>({});

  // Create URLs for all lists
  const connections = useMemo(() => {
    if (!endpoint) return [];

    return lists.map(list => {
      const key = `${list.cluster}:${list.namespace || ''}`;
      // Only update resourceVersion if it's newer
      if (
        !latestResourceVersions.current[key] ||
        parseInt(list.resourceVersion) > parseInt(latestResourceVersions.current[key])
      ) {
        latestResourceVersions.current[key] = list.resourceVersion;
      }

      return {
        url: makeUrl([KubeObjectEndpoint.toUrl(endpoint, list.namespace)], {
          ...queryParams,
          watch: 1,
          resourceVersion: latestResourceVersions.current[key],
        }),
        cluster: list.cluster,
        namespace: list.namespace,
      };
    });
  }, [endpoint, lists, queryParams]);

  useEffect(() => {
    if (!endpoint || connections.length === 0) return;

    const cleanups: (() => void)[] = [];

    connections.forEach(({ url, cluster, namespace }) => {
      const parsedUrl = new URL(url, BASE_WS_URL);
      const key = `${cluster}:${namespace || ''}`;

      WebSocketManager.subscribe(cluster, parsedUrl.pathname, parsedUrl.search.slice(1), update => {
        if (!update || typeof update !== 'object') return;

        // Update latest resourceVersion
        if (update.object?.metadata?.resourceVersion) {
          latestResourceVersions.current[key] = update.object.metadata.resourceVersion;
        }

        const queryKey = kubeObjectListQuery<K>(
          kubeObjectClass,
          endpoint,
          namespace,
          cluster,
          queryParams ?? {}
        ).queryKey;

        client.setQueryData(queryKey, (oldResponse: ListResponse<any> | undefined | null) => {
          if (!oldResponse) return oldResponse;
          const newList = KubeList.applyUpdate(oldResponse.list, update, kubeObjectClass);
          if (newList === oldResponse.list) return oldResponse;
          return { ...oldResponse, list: newList };
        });
      }).then(
        cleanup => cleanups.push(cleanup),
        error => {
          // Track retry count in the URL's searchParams
          const retryCount = parseInt(parsedUrl.searchParams.get('retryCount') || '0');
          if (retryCount < 3) {
            // Only log and allow retry if under threshold
            console.error('WebSocket subscription failed:', error);
            parsedUrl.searchParams.set('retryCount', (retryCount + 1).toString());
          }
        }
      );
    });

    return () => {
      cleanups.forEach(cleanup => cleanup());
    };
  }, [connections, endpoint, client, kubeObjectClass, queryParams]);
}

/**
 * Creates multiple requests to list Kube objects
 * Handles multiple clusters, namespaces and allowed namespaces
 *
 * @param clusters - list of clusters
 * @param getAllowedNamespaces -  function to get allowed namespaces for a cluster
 * @param isResourceNamespaced - if the resource is namespaced
 * @param requestedNamespaces - requested namespaces(optional)
 *
 * @returns list of requests for clusters and appropriate namespaces
 */
export function makeListRequests(
  clusters: string[],
  getAllowedNamespaces: (cluster: string | null) => string[],
  isResourceNamespaced: boolean,
  requestedNamespaces?: string[]
): Array<{ cluster: string; namespaces?: string[] }> {
  return clusters.map(cluster => {
    const allowedNamespaces = getAllowedNamespaces(cluster);

    let namespaces = requestedNamespaces ?? allowedNamespaces;
    if (allowedNamespaces.length) {
      namespaces = namespaces.filter(ns => allowedNamespaces.includes(ns));
    }

    return { cluster, namespaces: isResourceNamespaced ? namespaces : undefined };
  });
}

/**
 * Returns a combined list of Kubernetes objects and watches for changes from the clusters given.
 *
 * @param param - request paramaters
 * @returns Combined list of Kubernetes resources
 */
export function useKubeObjectList<K extends KubeObject>({
  requests,
  kubeObjectClass,
  queryParams,
  watch = true,
}: {
  requests: Array<{ cluster: string; namespaces?: string[] }>;
  /** Class to instantiate the object with */
  kubeObjectClass: (new (...args: any) => K) & typeof KubeObject<any>;
  queryParams?: QueryParameters;
  /** Watch for updates @default true */
  watch?: boolean;
}): [Array<K> | null, ApiError | null] &
  QueryListResponse<Array<ListResponse<K> | undefined | null>, K, ApiError> {
  const maybeNamespace = requests.find(it => it.namespaces)?.namespaces?.[0];

  // Get working endpoint from the first cluster
  // Now if clusters have different apiVersions for the same resource for example, this will not work
  const endpoint = useEndpoints(
    kubeObjectClass.apiEndpoint.apiInfo,
    requests[0]?.cluster,
    maybeNamespace
  );

  const cleanedUpQueryParams = Object.fromEntries(
    Object.entries(queryParams ?? {}).filter(([, value]) => value !== undefined && value !== '')
  );

  const queries = useMemo(
    () =>
      endpoint
        ? requests.flatMap(({ cluster, namespaces }) =>
            namespaces && namespaces.length > 0
              ? namespaces.map(namespace =>
                  kubeObjectListQuery<K>(
                    kubeObjectClass,
                    endpoint,
                    namespace,
                    cluster,
                    cleanedUpQueryParams
                  )
                )
              : kubeObjectListQuery<K>(
                  kubeObjectClass,
                  endpoint,
                  undefined,
                  cluster,
                  cleanedUpQueryParams
                )
          )
        : [],
    [requests, kubeObjectClass, endpoint, cleanedUpQueryParams]
  );

  const query = useQueries({
    queries,
    combine(results) {
      return {
        data: results.map(result => result.data),
        clusterResults: results.reduce((acc, result) => {
          if (result.data && result.data.cluster) {
            acc[result.data.cluster] = {
              data: result.data,
              error: result.error as any as ApiError | null,
              isError: result.isError,
              isFetching: result.isFetching,
              isLoading: result.isLoading,
              isSuccess: result.isSuccess,
              items: result?.data?.list?.items ?? null,
              status: result.status,
            };
          }
          return acc;
        }, {} as Record<string, QueryListResponse<any, K, ApiError>>),
        items: results.every(result => result.data === null)
          ? null
          : results.flatMap(result => result?.data?.list?.items ?? []),
        errors: results.map(result => result.error),
        clusterErrors: results
          .filter(result => result.error)
          .reduce((acc, result) => {
            if (result.error) {
              acc[result.error.cluster] = result.error as any as ApiError;
            }
            return acc;
          }, {} as Record<string, ApiError>),
        isError: results.some(result => result.isError),
        isLoading: results.some(result => result.isLoading),
        isFetching: results.some(result => result.isFetching),
        isSuccess: results.every(result => result.isSuccess),
      };
    },
  });

  const shouldWatch = watch && !query.isLoading;

  const [listsToWatch, setListsToWatch] = useState<
    { cluster: string; namespace?: string; resourceVersion: string }[]
  >([]);

  const listsNotYetWatched = query.data
    .filter(Boolean)
    .filter(
      data =>
        listsToWatch.find(
          // resourceVersion is intentionally omitted to avoid recreating WS connection when list is updated
          watching => watching.cluster === data?.cluster && watching.namespace === data.namespace
        ) === undefined
    )
    .map(data => ({
      cluster: data!.cluster,
      namespace: data!.namespace,
      resourceVersion: data!.list.metadata.resourceVersion,
    }));

  if (listsNotYetWatched.length > 0) {
    setListsToWatch([...listsToWatch, ...listsNotYetWatched]);
  }

  const listsToStopWatching = listsToWatch.filter(
    watching =>
      requests.find(request =>
        watching.cluster === request?.cluster && request.namespaces && watching.namespace
          ? request.namespaces?.includes(watching.namespace)
          : true
      ) === undefined
  );

  if (listsToStopWatching.length > 0) {
    setListsToWatch(listsToWatch.filter(it => !listsToStopWatching.includes(it)));
  }

  useWatchKubeObjectLists({
    lists: shouldWatch ? listsToWatch : [],
    endpoint,
    kubeObjectClass,
    queryParams: cleanedUpQueryParams,
  });

  // @ts-ignore - TS compiler gets confused with iterators
  return {
    items: query.items,
    clusterResults: query.clusterResults,
    clusterErrors: query.clusterErrors,
    isError: query.isError,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isSuccess: query.isSuccess,
    *[Symbol.iterator](): ArrayIterator<ApiError | K[] | null> {
      yield query.items;
      yield query.errors[0] as any as ApiError;
    },
  };
}

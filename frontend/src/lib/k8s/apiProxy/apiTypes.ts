import { OpPatch } from 'json-patch';
import { KubeMetadata, KubeObjectInterface } from '../cluster';

type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type StreamUpdate<T> = {
  type: 'ADDED' | 'MODIFIED' | 'DELETED' | 'ERROR';
  object: T;
};

export type CancelFunction = () => void;

export type StreamResultsCb<T> = (data: T[]) => void;
export type StreamUpdatesCb<T> = (data: StreamUpdate<T>) => void;

export type StreamErrCb = (err: Error & { status?: number }, cancelStreamFunc?: () => void) => void;

export type SingleApiFactoryArguments = [group: string, version: string, resource: string];
export type MultipleApiFactoryArguments = SingleApiFactoryArguments[];
export type ApiFactoryArguments = SingleApiFactoryArguments | MultipleApiFactoryArguments;

export type SimpleApiFactoryWithNamespaceArguments = [
  group: string,
  version: string,
  resource: string,
  includeScale?: boolean
];
export type MultipleApiFactoryWithNamespaceArguments = SimpleApiFactoryWithNamespaceArguments[];
export type ApiFactoryWithNamespaceArguments =
  | SimpleApiFactoryWithNamespaceArguments
  | MultipleApiFactoryWithNamespaceArguments;

export interface ApiClient<ResourceType extends KubeObjectInterface> {
  list: (
    cb: StreamResultsCb<ResourceType>,
    errCb: StreamErrCb,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<CancelFunction>;
  get: (
    name: string,
    cb: StreamResultsCb<ResourceType>,
    errCb: StreamErrCb,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<CancelFunction>;
  post: (
    body: RecursivePartial<ResourceType>,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<ResourceType>;
  put: (
    body: ResourceType,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<ResourceType>;
  patch: (
    body: OpPatch[],
    name: string,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<ResourceType>;
  delete: (name: string, queryParams?: QueryParameters, cluster?: string) => Promise<any>;
  isNamespaced: boolean;
  apiInfo: {
    group: string;
    version: string;
    resource: string;
  }[];
}

export interface ApiWithNamespaceClient<ResourceType extends KubeObjectInterface> {
  list: (
    namespace: string,
    cb: StreamResultsCb<ResourceType>,
    errCb: StreamErrCb,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<CancelFunction>;
  get: (
    namespace: string,
    name: string,
    cb: StreamResultsCb<ResourceType>,
    errCb: StreamErrCb,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<CancelFunction>;
  post: (
    body: RecursivePartial<KubeObjectInterface>,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<any>;
  put: (
    body: KubeObjectInterface,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<ResourceType>;
  patch: (
    body: OpPatch[],
    namespace: string,
    name: string,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<any>;
  delete: (
    namespace: string,
    name: string,
    queryParams?: QueryParameters,
    cluster?: string
  ) => Promise<any>;
  isNamespaced: boolean;
  apiInfo: {
    group: string;
    version: string;
    resource: string;
  }[];
  scale?: ScaleApi;
}

export interface ScaleApi {
  get: (namespace: string, name: string, clusterName?: string) => Promise<any>;
  put: (
    body: {
      metadata: KubeMetadata;
      spec: {
        replicas: number;
      };
    },
    clusterName?: string
  ) => Promise<any>;
  patch: (
    body: {
      spec: {
        replicas: number;
      };
    },
    metadata: KubeMetadata,
    clusterName?: string
  ) => Promise<any>;
}

/**
 * Describes the API for a certain resource.
 */
export interface ApiInfo {
  /** The API group. */
  group: string;
  /** The API version. */
  version: string;
  /** The resource name. */
  resource: string;
}

export interface ApiError extends Error {
  status: number;
}

/**
 * Options for the request.
 */
export interface RequestParams extends RequestInit {
  /** Number of milliseconds to wait for a response. */
  timeout?: number;
  /** Is the request expected to receive JSON data? */
  isJSON?: boolean;
  /** Cluster context name. */
  cluster?: string | null;
  /** Whether to automatically log out the user if there is an authentication error. */
  autoLogoutOnAuthError?: boolean;
}

export interface ClusterRequest {
  /** The name of the cluster (has to be unique, or it will override an existing cluster) */
  name?: string;
  /** The cluster URL */
  server?: string;
  /** Whether the server's certificate should not be checked for validity */
  insecureTLSVerify?: boolean;
  /** The certificate authority data */
  certificateAuthorityData?: string;
  /** KubeConfig (base64 encoded)*/
  kubeconfig?: string;
}

/**
 * The options for `clusterRequest`.
 */
export interface ClusterRequestParams extends RequestParams {
  cluster?: string | null;
  autoLogoutOnAuthError?: boolean;
}

// @todo: QueryParamaters should be specific to different resources.
//        Because some only support some paramaters.

/**
 * QueryParamaters is a map of query parameters for the Kubernetes API.
 */
export interface QueryParameters {
  /**
   * Continue token for paging through large result sets.
   *
   * The continue option should be set when retrieving more results from the server.
   * Since this value is server defined, clients may only use the continue value
   * from a previous query result with identical query parameters
   * (except for the value of continue) and the server may reject a continue value
   * it does not recognize. If the specified continue value is no longer valid
   * whether due to expiration (generally five to fifteen minutes) or a
   * configuration change on the server, the server will respond with a
   * 410 ResourceExpired error together with a continue token. If the client
   * needs a consistent list, it must restart their list without the continue field.
   * Otherwise, the client may send another list request with the token received
   * with the 410 error, the server will respond with a list starting from the next
   * key, but from the latest snapshot, which is inconsistent from the previous
   * list results - objects that are created, modified, or deleted after the first
   * list request will be included in the response, as long as their keys are after
   * the "next key".
   *
   * This field is not supported when watch is true. Clients may start a watch from
   * the last resourceVersion value returned by the server and not miss any modifications.
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks
   */
  continue?: string;
  /**
   * dryRun causes apiserver to simulate the request, and report whether the object would be modified.
   * Can be '' or 'All'
   *
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#dry-run
   */
  dryRun?: string;
  /**
   * fieldSeletor restricts the list of returned objects by their fields. Defaults to everything.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/field-selectors/
   */
  fieldSelector?: string;
  /**
   * labelSelector restricts the list of returned objects by their labels. Defaults to everything.
   *
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#api
   * @see https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/#label-selectors
   */
  labelSelector?: string;
  /**
   * limit is a maximum number of responses to return for a list call.
   *
   * If more items exist, the server will set the continue field on the list
   * metadata to a value that can be used with the same initial query to retrieve
   * the next set of results. Setting a limit may return fewer than the requested
   * amount of items (up to zero items) in the event all requested objects are
   * filtered out and clients should only use the presence of the continue field
   * to determine whether more results are available. Servers may choose not to
   * support the limit argument and will return all of the available results.
   * If limit is specified and the continue field is empty, clients may assume
   * that no more results are available.
   *
   * This field is not supported if watch is true.
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#retrieving-large-results-sets-in-chunks
   */
  limit?: string | number;
  /**
   * resourceVersion sets a constraint on what resource versions a request may be served from.
   * Defaults to unset
   *
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#resource-versions
   */
  resourceVersion?: string;
  /**
   * allowWatchBookmarks means watch events with type "BOOKMARK" will also be sent.
   *
   * Can be 'true'
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#watch-bookmarks
   */
  allowWatchBookmarks?: string;
  /**
   * sendInitialEvents controls whether the server will send the events
   * for a watch before sending the current list state.
   *
   * Can be 'true'.
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#streaming-lists
   */
  sendInitialEvents?: string;
  /**
   * The resource version to match.
   *
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#semantics-for-get-and-list
   */
  resourceVersionMatch?: string;
  /**
   * If 'true', then the output is pretty printed.
   * Can be '' or 'true'
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#output-options
   */
  pretty?: string;
  /**
   * watch instead of a list or get, watch for changes to the requested object(s).
   *
   * Can be 1.
   * @see https://kubernetes.io/docs/reference/using-api/api-concepts/#efficient-detection-of-changes
   */
  watch?: string;
}

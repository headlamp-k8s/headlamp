/*
 * This module was originally taken from the K8dash project before modifications.
 *
 * K8dash is licensed under Apache License 2.0.
 *
 * Copyright © 2020 Eric Herbrandson
 * Copyright © 2020 Kinvolk GmbH
 */

import { OpPatch } from 'json-patch';
import _ from 'lodash';
import { decodeToken } from 'react-jwt';
import helpers, { getHeadlampAPIHeaders, isDebugVerbose } from '../../helpers';
import store from '../../redux/stores/store';
import { getToken, logout, setToken } from '../auth';
import { getCluster } from '../util';
import { KubeMetadata, KubeMetrics, KubeObjectInterface } from './cluster';
import { KubeToken } from './token';

// Uncomment the following lines to enable verbose debug logging in this module.
// import { debugVerbose } from '../../helpers';
// debugVerbose('k8s/apiProxy');

const BASE_HTTP_URL = helpers.getAppUrl();
const BASE_WS_URL = BASE_HTTP_URL.replace('http', 'ws');
const CLUSTERS_PREFIX = 'clusters';
const JSON_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };
const DEFAULT_TIMEOUT = 2 * 60 * 1000; // ms
const MIN_LIFESPAN_FOR_TOKEN_REFRESH = 10; // sec

let isTokenRefreshInProgress = false;

// @todo: Params is a confusing name for options, because params are also query params.
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

/**
 * Refreshes the token if it is about to expire.
 *
 * @param token - The token to refresh. For null token it just does nothing.
 *
 * @note Sets the token with `setToken` if the token is refreshed.
 * @note Uses global `isTokenRefreshInProgress` to prevent multiple token
 * refreshes at the same time.
 */
async function refreshToken(token: string | null) {
  if (!token || isTokenRefreshInProgress) {
    return;
  }
  // decode token
  const decodedToken: any = decodeToken(token);

  // return if the token doesn't have an expiry time
  if (!decodedToken.exp) {
    return;
  }
  // convert expiry seconds to date object
  const expiry = decodedToken.exp;
  const now = new Date().valueOf();
  const expDate = new Date(0);
  expDate.setUTCSeconds(expiry);

  // calculate time to expiry in seconds
  const diff = (expDate.valueOf() - now) / 1000;
  // If the token is not about to expire return
  // comparing the time to expiry with the minimum lifespan for a token both in seconds
  if (diff > MIN_LIFESPAN_FOR_TOKEN_REFRESH) {
    return;
  }
  const namespace =
    (decodedToken && decodedToken['kubernetes.io'] && decodedToken['kubernetes.io']['namespace']) ||
    '';
  const serviceAccountName =
    (decodedToken &&
      decodedToken['kubernetes.io'] &&
      decodedToken['kubernetes.io']['serviceaccount'] &&
      decodedToken['kubernetes.io']['serviceaccount']['name']) ||
    {};
  const cluster = getCluster();
  if (!cluster || namespace === '' || serviceAccountName === '') {
    return;
  }

  if (isDebugVerbose('k8s/apiProxy@refreshToken')) {
    console.debug('k8s/apiProxy@refreshToken', 'Refreshing token');
  }

  isTokenRefreshInProgress = true;

  let tokenUrl = combinePath(BASE_HTTP_URL, `/${CLUSTERS_PREFIX}/${cluster}`);
  tokenUrl = combinePath(
    tokenUrl,
    `api/v1/namespaces/${namespace}/serviceaccounts/${serviceAccountName}/token`
  );
  const tokenData = {
    kind: 'TokenRequest',
    apiVersion: 'authentication.k8s.io/v1',
    metadata: { creationTimestamp: null },
    spec: { expirationSeconds: 86400 },
  };

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, ...JSON_HEADERS },
      body: JSON.stringify(tokenData),
    });

    if (response.status === 201) {
      const token: KubeToken = await response.json();
      setToken(cluster, token.status.token);
    }

    isTokenRefreshInProgress = false;
  } catch (err) {
    console.error('Error refreshing token', err);
    isTokenRefreshInProgress = false;
  }
}

/**
 * @returns Auth type of the cluster, or an empty string if the cluster is not found.
 * It could return 'oidc' or '' for example.
 *
 * @param cluster - Name of the cluster.
 */
function getClusterAuthType(cluster: string): string {
  const state = store.getState();
  const authType: string = state.config?.clusters?.[cluster]?.['auth_type'] || '';
  return authType;
}

/**
 * Sends a request to the backend. If the useCluster parameter is true (which it is, by default), it will be
 * treated as a request to the Kubernetes server of the currently defined (in the URL) cluster.
 *
 * @param path - The path to the API endpoint.
 * @param params - Optional parameters for the request.
 * @param autoLogoutOnAuthError - Whether to automatically log out the user if there is an authentication error.
 * @param useCluster - Whether to use the current cluster for the request.
 * @param queryParams - Optional query parameters for the request.
 *
 * @returns A Promise that resolves to the JSON response from the API server.
 * @throws An ApiError if the response status is not ok.
 */
export async function request(
  path: string,
  params: RequestParams = {},
  autoLogoutOnAuthError: boolean = true,
  useCluster: boolean = true,
  queryParams?: QueryParameters
) {
  // @todo: This is a temporary way of getting the current cluster. We should improve it later.
  const cluster = (useCluster && getCluster()) || '';

  if (isDebugVerbose('k8s/apiProxy@request')) {
    console.debug('k8s/apiProxy@request', { path, params, useCluster, queryParams });
  }

  return clusterRequest(path, { cluster, autoLogoutOnAuthError, ...params }, queryParams);
}

/**
 * The options for `clusterRequest`.
 */
export interface ClusterRequestParams extends RequestParams {
  cluster?: string | null;
  autoLogoutOnAuthError?: boolean;
}

/**
 * Sends a request to the backend. If the cluster is required in the params parameter, it will
 * be used as a request to the respective Kubernetes server.
 *
 * @param path - The path to the API endpoint.
 * @param params - Optional parameters for the request.
 * @param queryParams - Optional query parameters for the k8s request.
 *
 * @returns A Promise that resolves to the JSON response from the API server.
 * @throws An ApiError if the response status is not ok.
 */
export async function clusterRequest(
  path: string,
  params: ClusterRequestParams = {},
  queryParams?: QueryParameters
) {
  interface RequestHeaders {
    Authorization?: string;
    cluster?: string;
    autoLogoutOnAuthError?: boolean;
    [otherHeader: string]: any;
  }

  const {
    timeout = DEFAULT_TIMEOUT,
    cluster: paramsCluster,
    autoLogoutOnAuthError = true,
    isJSON = true,
    ...otherParams
  } = params;
  const opts: { headers: RequestHeaders } = Object.assign({ headers: {} }, otherParams);
  const cluster = paramsCluster || '';

  let fullPath = path;
  if (cluster) {
    const token = getToken(cluster);

    // Refresh service account token only if the cluster auth type is not OIDC
    if (getClusterAuthType(cluster) !== 'oidc') {
      await refreshToken(token);
    }

    if (!!token) {
      opts.headers.Authorization = `Bearer ${token}`;
    }

    fullPath = combinePath(`/${CLUSTERS_PREFIX}/${cluster}`, path);
  }

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  let url = combinePath(BASE_HTTP_URL, fullPath);
  url += asQuery(queryParams);
  const requestData = { signal: controller.signal, ...opts };
  let response: Response = new Response(undefined, { status: 502, statusText: 'Unreachable' });
  try {
    response = await fetch(url, requestData);
  } catch (err) {
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        response = new Response(undefined, { status: 408, statusText: 'Request timed-out' });
      }
    }
  } finally {
    clearTimeout(id);
  }

  // The backend signals through this header that it wants a reload.
  // See plugins.go
  const headerVal = response.headers.get('X-Reload');
  if (headerVal && headerVal.indexOf('reload') !== -1) {
    window.location.reload();
  }

  // In case of OIDC auth if the token is about to expire the backend
  // sends a refreshed token in the response header.
  const newToken = response.headers.get('X-Authorization');
  if (newToken) {
    setToken(cluster, newToken);
  }

  if (!response.ok) {
    const { status, statusText } = response;
    if (autoLogoutOnAuthError && status === 401 && opts.headers.Authorization) {
      console.error('Logging out due to auth error', { status, statusText, path });
      logout();
    }

    let message = statusText;
    try {
      if (isJSON) {
        const json = await response.json();
        message += ` - ${json.message}`;
      }
    } catch (err) {
      console.error(
        'Unable to parse error json at url:',
        url,
        { err },
        'with request data:',
        requestData
      );
    }

    const error = new Error(message) as ApiError;
    error.status = status;
    return Promise.reject(error);
  }

  if (!isJSON) {
    return Promise.resolve(response);
  }

  return response.json();
}

// @todo: there should be more specific args and types on StreamResultsCb than '...args: any'.

/** The callback that's called when some results are streamed in. */
export type StreamResultsCb = (...args: any[]) => void;
/** The callback that's called when there's an error streaming the results. */
export type StreamErrCb = (err: Error & { status?: number }, cancelStreamFunc?: () => void) => void;

type ApiFactoryReturn = ReturnType<typeof apiFactory> | ReturnType<typeof apiFactoryWithNamespace>;

// @todo: repeatStreamFunc could be improved for performance by remembering when a URL
//       is 404 and not trying it again... and again.

/**
 * Repeats a streaming function call across multiple API endpoints until a
 * successful response is received or all endpoints have been exhausted.
 *
 * This is especially useful for Kubernetes beta APIs that then stabalize.
 * So the APIs are available at different endpoints on different versions of Kubernetes.
 *
 * @param apiEndpoints - An array of API endpoint objects returned by the `apiFactory` function.
 * @param funcName - The name of the streaming function to call on each endpoint.
 * @param errCb - A callback function to handle errors that occur during the streaming function call.
 * @param args - Additional arguments to pass to the streaming function.
 *
 * @returns A function that cancels the streaming function call.
 */
async function repeatStreamFunc(
  apiEndpoints: ApiFactoryReturn[],
  funcName: keyof ApiFactoryReturn,
  errCb: StreamErrCb,
  ...args: any[]
) {
  let isCancelled = false;
  let streamCancel = () => {};

  if (isDebugVerbose('k8s/apiProxy@repeatStreamFunc')) {
    console.debug('k8s/apiProxy@repeatStreamFunc', { apiEndpoints, funcName, args });
  }

  function runStreamFunc(
    endpointIndex: number,
    funcName: string,
    errCb: StreamErrCb,
    ...args: any[]
  ) {
    const endpoint = apiEndpoints[endpointIndex];
    return endpoint[funcName as keyof ApiFactoryReturn](...args, errCb);
  }

  let endpointIndex = 0;
  const cancel: StreamErrCb = async (err, cancelStream) => {
    if (isCancelled) {
      return;
    }
    if (err.status === 404 && endpointIndex < apiEndpoints.length) {
      // Cancel current stream
      if (cancelStream) {
        cancelStream();
      }

      streamCancel = await runStreamFunc(endpointIndex++, funcName, cancel, ...args);
    } else if (!!errCb) {
      errCb(err, streamCancel);
    }
  };

  streamCancel = await runStreamFunc(endpointIndex++, funcName, cancel, ...args);

  return () => {
    isCancelled = true;
    streamCancel();
  };
}

/**
 * Repeats a factory method call across multiple API endpoints until a
 * successful response is received or all endpoints have been exhausted.
 *
 * This is especially useful for Kubernetes beta APIs that then stabalize.
 * @param apiEndpoints - An array of API endpoint objects returned by the `apiFactory` function.
 * @param funcName - The name of the factory method to call on each endpoint.
 *
 * @returns A function that cancels the factory method call.
 */
function repeatFactoryMethod(apiEndpoints: ApiFactoryReturn[], funcName: keyof ApiFactoryReturn) {
  return async (...args: Parameters<ApiFactoryReturn[typeof funcName]>) => {
    for (let i = 0; i < apiEndpoints.length; i++) {
      try {
        const endpoint = apiEndpoints[i];
        return await endpoint[funcName](...args);
      } catch (err) {
        // If the error is 404 and we still have other endpoints, then try the next one
        if ((err as ApiError).status === 404 && i !== apiEndpoints.length - 1) {
          continue;
        }

        throw err;
      }
    }
  };
}

// @todo: in apiFactory, and multipleApiFactory use rather than 'args'...
//        `group: string, version: string, resource: string`

/**
 * Creates an API client for a single or multiple Kubernetes resources.
 *
 * @param args - The arguments to pass to either `singleApiFactory` or `multipleApiFactory`.
 *
 * @returns An API client for the specified Kubernetes resource(s).
 */
export function apiFactory(
  ...args: Parameters<typeof singleApiFactory> | Parameters<typeof multipleApiFactory>
) {
  if (isDebugVerbose('k8s/apiProxy@apiFactory')) {
    console.debug('k8s/apiProxy@apiFactory', { args });
  }

  if (args[0] instanceof Array) {
    return multipleApiFactory(...(args as Parameters<typeof multipleApiFactory>));
  }

  return singleApiFactory(...(args as Parameters<typeof singleApiFactory>));
}

/**
 * Creates an API endpoint object for multiple API endpoints.
 * It first tries the first endpoint, then the second, and so on until it
 * gets a successful response.
 *
 * @param args - An array of arguments to pass to the `singleApiFactory` function.
 *
 * @returns An API endpoint object.
 */
function multipleApiFactory(
  ...args: Parameters<typeof singleApiFactory>[]
): ReturnType<typeof singleApiFactory> {
  if (isDebugVerbose('k8s/apiProxy@multipleApiFactory')) {
    console.debug('k8s/apiProxy@multipleApiFactory', { args });
  }

  const apiEndpoints: ReturnType<typeof singleApiFactory>[] = args.map(apiArgs =>
    singleApiFactory(...apiArgs)
  );

  return {
    list: (cb: StreamResultsCb, errCb: StreamErrCb) =>
      repeatStreamFunc(apiEndpoints, 'list', errCb, cb),
    get: (name: string, cb: StreamResultsCb, errCb: StreamErrCb) =>
      repeatStreamFunc(apiEndpoints, 'get', errCb, name, cb),
    post: repeatFactoryMethod(apiEndpoints, 'post'),
    patch: repeatFactoryMethod(apiEndpoints, 'patch'),
    put: repeatFactoryMethod(apiEndpoints, 'put'),
    delete: repeatFactoryMethod(apiEndpoints, 'delete'),
    isNamespaced: false,
    apiInfo: args.map(apiArgs => ({
      group: apiArgs[0],
      version: apiArgs[1],
      resource: apiArgs[2],
    })),
  };
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

// @todo: singleApiFactory should have a return type rather than just what it returns.

/**
 * @returns An object with methods for interacting with a single API endpoint.
 *
 * @param group - The API group.
 * @param version - The API version.
 * @param resource - The API resource.
 */
function singleApiFactory(group: string, version: string, resource: string) {
  if (isDebugVerbose('k8s/apiProxy@singleApiFactory')) {
    console.debug('k8s/apiProxy@singleApiFactory', { group, version, resource });
  }

  const apiRoot = getApiRoot(group, version);
  const url = `${apiRoot}/${resource}`;
  return {
    list: (cb: StreamResultsCb, errCb: StreamErrCb, queryParams?: QueryParameters) => {
      if (isDebugVerbose('k8s/apiProxy@singleApiFactory list')) {
        console.debug('k8s/apiProxy@singleApiFactory list', { queryParams });
      }

      return streamResults(url, cb, errCb, queryParams);
    },
    get: (name: string, cb: StreamResultsCb, errCb: StreamErrCb, queryParams?: QueryParameters) =>
      streamResult(url, name, cb, errCb, queryParams),
    post: (body: KubeObjectInterface, queryParams?: QueryParameters) =>
      post(url + asQuery(queryParams), body),
    put: (body: KubeObjectInterface, queryParams?: QueryParameters) =>
      put(`${url}/${body.metadata.name}` + asQuery(queryParams), body),
    patch: (body: OpPatch[], name: string, queryParams?: QueryParameters) =>
      patch(`${url}/${name}` + asQuery({ ...queryParams, ...{ pretty: 'true' } }), body),
    delete: (name: string, queryParams?: QueryParameters) =>
      remove(`${url}/${name}` + asQuery(queryParams)),
    isNamespaced: false,
    apiInfo: [{ group, version, resource }],
  };
}

// @todo: just use args from simpleApiFactoryWithNamespace, rather than `args`?
//        group: string, version: string, resource: string, includeScale: boolean = false

export function apiFactoryWithNamespace(
  ...args:
    | Parameters<typeof simpleApiFactoryWithNamespace>
    | Parameters<typeof multipleApiFactoryWithNamespace>
) {
  if (args[0] instanceof Array) {
    return multipleApiFactoryWithNamespace(
      ...(args as Parameters<typeof multipleApiFactoryWithNamespace>)
    );
  }

  return simpleApiFactoryWithNamespace(
    ...(args as Parameters<typeof simpleApiFactoryWithNamespace>)
  );
}

function multipleApiFactoryWithNamespace(
  ...args: Parameters<typeof simpleApiFactoryWithNamespace>[]
): ReturnType<typeof simpleApiFactoryWithNamespace> {
  const apiEndpoints: ReturnType<typeof simpleApiFactoryWithNamespace>[] = args.map(apiArgs =>
    simpleApiFactoryWithNamespace(...apiArgs)
  );

  return {
    list: (namespace: string, cb: StreamResultsCb, errCb: StreamErrCb) =>
      repeatStreamFunc(apiEndpoints, 'list', errCb, namespace, cb),
    get: (namespace: string, name: string, cb: StreamResultsCb, errCb: StreamErrCb) =>
      repeatStreamFunc(apiEndpoints, 'get', errCb, namespace, name, cb),
    post: repeatFactoryMethod(apiEndpoints, 'post'),
    patch: repeatFactoryMethod(apiEndpoints, 'patch'),
    put: repeatFactoryMethod(apiEndpoints, 'put'),
    delete: repeatFactoryMethod(apiEndpoints, 'delete'),
    isNamespaced: true,
    apiInfo: args.map(apiArgs => ({
      group: apiArgs[0],
      version: apiArgs[1],
      resource: apiArgs[2],
    })),
  };
}

function simpleApiFactoryWithNamespace(
  group: string,
  version: string,
  resource: string,
  includeScale: boolean = false
) {
  if (isDebugVerbose('k8s/apiProxy@simpleApiFactoryWithNamespace')) {
    console.debug('k8s/apiProxy@simpleApiFactoryWithNamespace', {
      group,
      version,
      resource,
      includeScale,
    });
  }

  const apiRoot = getApiRoot(group, version);
  const results: {
    scale?: ReturnType<typeof apiScaleFactory>;
    // @todo: Need to write types for these properties instead.
    [other: string]: any;
  } = {
    list: (
      namespace: string,
      cb: StreamResultsCb,
      errCb: StreamErrCb,
      queryParams?: QueryParameters
    ) => {
      if (isDebugVerbose('k8s/apiProxy@simpleApiFactoryWithNamespace list')) {
        console.debug('k8s/apiProxy@simpleApiFactoryWithNamespace list', { queryParams });
      }

      return streamResults(url(namespace), cb, errCb, queryParams);
    },
    get: (
      namespace: string,
      name: string,
      cb: StreamResultsCb,
      errCb: StreamErrCb,
      queryParams?: QueryParameters
    ) => streamResult(url(namespace), name, cb, errCb, queryParams),
    post: (body: KubeObjectInterface, queryParams?: QueryParameters) =>
      post(url(body.metadata.namespace!) + asQuery(queryParams), body),
    patch: (body: OpPatch[], namespace: string, name: string, queryParams?: QueryParameters) =>
      patch(`${url(namespace)}/${name}` + asQuery({ ...queryParams, ...{ pretty: 'true' } }), body),
    put: (body: KubeObjectInterface, queryParams?: QueryParameters) =>
      put(`${url(body.metadata.namespace!)}/${body.metadata.name}` + asQuery(queryParams), body),
    delete: (namespace: string, name: string, queryParams?: QueryParameters) =>
      remove(`${url(namespace)}/${name}` + asQuery(queryParams)),
    isNamespaced: true,
    apiInfo: [{ group, version, resource }],
  };

  if (includeScale) {
    results.scale = apiScaleFactory(apiRoot, resource);
  }

  return results;

  function url(namespace: string) {
    return namespace ? `${apiRoot}/namespaces/${namespace}/${resource}` : `${apiRoot}/${resource}`;
  }
}

/**
 * Converts k8s queryParams to a URL query string.
 *
 * @param queryParams - The k8s API query parameters to convert.
 * @returns The query string (starting with '?'), or empty string.
 */
function asQuery(queryParams?: QueryParameters): string {
  if (queryParams === undefined) {
    return '';
  }

  let newQueryParams;
  if (typeof queryParams.limit === 'number' || typeof queryParams.limit === 'string') {
    newQueryParams = {
      ...queryParams,
      limit:
        typeof queryParams.limit === 'number' ? queryParams.limit.toString() : queryParams.limit,
    };
  } else {
    newQueryParams = { ..._.omit(queryParams, 'limit') };
  }

  return !!newQueryParams && !!Object.keys(newQueryParams).length
    ? '?' + new URLSearchParams(newQueryParams).toString()
    : '';
}

async function resourceDefToApiFactory(
  resourceDef: KubeObjectInterface
): Promise<ApiFactoryReturn> {
  interface APIResourceList {
    resources: {
      kind: string;
      namespaced: boolean;
      singularName: string;
      name: string;
    }[];
    [other: string]: any;
  }
  if (isDebugVerbose('k8s/apiProxy@resourceDefToApiFactory')) {
    console.debug('k8s/apiProxy@resourceDefToApiFactory', { resourceDef });
  }

  if (!resourceDef.kind) {
    throw new Error(`Cannot handle unknown resource kind: ${resourceDef.kind}`);
  }

  if (!resourceDef.apiVersion) {
    throw new Error(`Definition ${resourceDef.kind} has no apiVersion`);
  }

  let [apiGroup, apiVersion] = resourceDef.apiVersion.split('/');

  // There may not be an API group [1], which means that the apiGroup variable will
  // actually hold the apiVersion, so we switch them.
  // [1] https://kubernetes.io/docs/reference/using-api/#api-groups
  if (!!apiGroup && !apiVersion) {
    apiVersion = apiGroup;
    apiGroup = '';
  }

  if (!apiVersion) {
    throw new Error(`apiVersion has no version string: ${resourceDef.apiVersion}`);
  }

  // Get details about this resource. We could avoid this for known resources, but
  // this way we always get the right plural name and we also avoid eventually getting
  // the wrong "known" resource because e.g. there can be CustomResources with the same
  // kind as a known resource.
  const apiPrefix = !!apiGroup ? 'apis' : 'api';
  const apiResult: APIResourceList = await request(
    `/${apiPrefix}/${resourceDef.apiVersion}`,
    {},
    false
  );
  if (!apiResult) {
    throw new Error(`Unkown apiVersion: ${resourceDef.apiVersion}`);
  }

  // Get resource
  const resource = apiResult.resources?.find(({ kind }) => kind === resourceDef.kind);

  if (!resource) {
    throw new Error(`Unkown resource kind: ${resourceDef.kind}`);
  }

  const hasNamespace = !!resource.namespaced;

  let factoryFunc: typeof apiFactory | typeof apiFactoryWithNamespace = apiFactory;
  if (!!hasNamespace) {
    factoryFunc = apiFactoryWithNamespace;
  }

  return factoryFunc(apiGroup, apiVersion, resource.name);
}

function getApiRoot(group: string, version: string) {
  return group ? `/apis/${group}/${version}` : `api/${version}`;
}

function apiScaleFactory(apiRoot: string, resource: string) {
  return {
    get: (namespace: string, name: string) => request(url(namespace, name)),
    put: (body: { metadata: KubeMetadata; spec: { replicas: number } }) =>
      put(url(body.metadata.namespace!, body.metadata.name), body),
  };

  function url(namespace: string, name: string) {
    return `${apiRoot}/namespaces/${namespace}/${resource}/${name}/scale`;
  }
}

export function post(
  url: string,
  json: JSON | object | KubeObjectInterface,
  autoLogoutOnAuthError = true,
  requestOptions = {}
) {
  const body = JSON.stringify(json);
  const opts = { method: 'POST', body, headers: JSON_HEADERS, ...requestOptions };
  return request(url, opts, autoLogoutOnAuthError);
}

export function patch(url: string, json: any, autoLogoutOnAuthError = true, requestOptions = {}) {
  const body = JSON.stringify(json);
  const opts = {
    method: 'PATCH',
    body,
    headers: { ...JSON_HEADERS, 'Content-Type': 'application/json-patch+json' },
    ...requestOptions,
  };
  return request(url, opts, autoLogoutOnAuthError);
}

export function put(
  url: string,
  json: Partial<KubeObjectInterface>,
  autoLogoutOnAuthError = true,
  requestOptions = {}
) {
  const body = JSON.stringify(json);
  const opts = { method: 'PUT', body, headers: JSON_HEADERS, ...requestOptions };
  return request(url, opts, autoLogoutOnAuthError);
}

export function remove(url: string, requestOptions = {}) {
  const opts = { method: 'DELETE', headers: JSON_HEADERS, ...requestOptions };
  return request(url, opts);
}

/**
 * Streams the results of a Kubernetes API request into a 'cb' callback.
 *
 * @param url - The URL of the Kubernetes API endpoint.
 * @param name - The name of the Kubernetes API resource.
 * @param cb - The callback function to execute when the stream receives data.
 * @param errCb - The callback function to execute when an error occurs.
 * @param queryParams - The query parameters to include in the API request.
 *
 * @returns A function to cancel the stream.
 */
export async function streamResult(
  url: string,
  name: string,
  cb: StreamResultsCb,
  errCb: StreamErrCb,
  queryParams?: QueryParameters
) {
  let isCancelled = false;
  let socket: ReturnType<typeof stream>;

  if (isDebugVerbose('k8s/apiProxy@streamResult')) {
    console.debug('k8s/apiProxy@streamResult', { url, name, queryParams });
  }

  run();

  return cancel;

  async function run() {
    try {
      const item = await request(`${url}/${name}` + asQuery(queryParams));

      if (isCancelled) return;

      if (isDebugVerbose('k8s/apiProxy@streamResult run cb(item)')) {
        console.debug('k8s/apiProxy@streamResult run cb(item)', { item });
      }

      cb(item);

      const watchUrl =
        url +
        asQuery({ ...queryParams, ...{ watch: '1', fieldSelector: `metadata.name=${name}` } });

      socket = stream(watchUrl, x => cb(x.object), { isJson: true });
    } catch (err) {
      console.error('Error in api request', { err, url });
      // @todo: sometimes errCb is {}, the typing for apiProxy needs improving.
      //        See https://github.com/kinvolk/headlamp/pull/833
      if (errCb && typeof errCb === 'function') errCb(err as ApiError, cancel);
    }
  }

  function cancel() {
    if (isCancelled) return;
    isCancelled = true;

    if (socket) socket.cancel();
  }
}

/**
 * Streams the results of a Kubernetes API request.
 *
 * @param url - The URL of the Kubernetes API endpoint.
 * @param cb - The callback function to execute when the stream receives data.
 * @param errCb - The callback function to execute when an error occurs.
 * @param queryParams - The query parameters to include in the API request.
 *
 * @returns A function to cancel the stream.
 */
export async function streamResults(
  url: string,
  cb: StreamResultsCb,
  errCb: StreamErrCb,
  queryParams: QueryParameters | undefined
) {
  const results: {
    [uid: string]: KubeObjectInterface;
  } = {};
  let isCancelled = false;
  let socket: ReturnType<typeof stream>;

  if (isDebugVerbose('k8s/apiProxy@streamResults')) {
    console.debug('k8s/apiProxy@streamResults', { url, queryParams });
  }

  // -1 means unlimited.
  const maxResources =
    typeof queryParams?.limit === 'number'
      ? queryParams.limit
      : parseInt(queryParams?.limit ?? '-1');

  run();

  return cancel;

  async function run() {
    try {
      const { kind, items, metadata } = await request(url + asQuery(queryParams));

      if (isCancelled) return;

      add(items, kind);

      const watchUrl =
        url +
        asQuery({ ...queryParams, ...{ watch: '1', resourceVersion: metadata.resourceVersion } });
      socket = stream(watchUrl, update, { isJson: true });
    } catch (err) {
      console.error('Error in api request', { err, url });
      if (errCb && typeof errCb === 'function') {
        errCb(err as ApiError, cancel);
      }
    }
  }

  function cancel() {
    if (isCancelled) return;
    isCancelled = true;

    if (socket) socket.cancel();
  }

  function add(items: KubeObjectInterface[], kind: string) {
    const fixedKind = kind.slice(0, -4); // Trim off the word "List" from the end of the string
    for (const item of items) {
      item.kind = fixedKind;
      results[item.metadata.uid] = item;
    }

    push();
  }

  function update({
    type,
    object,
  }: {
    type: 'ADDED' | 'MODIFIED' | 'DELETED' | 'ERROR';
    object: KubeObjectInterface;
  }) {
    object.actionType = type; // eslint-disable-line no-param-reassign

    switch (type) {
      case 'ADDED':
        results[object.metadata.uid] = object;
        break;
      case 'MODIFIED': {
        const existing = results[object.metadata.uid];

        if (existing) {
          if (!existing.metadata.resourceVersion || !object.metadata.resourceVersion) {
            console.error('Missing resourceVersion in object', object);
            break;
          }
          const currentVersion = parseInt(existing.metadata.resourceVersion, 10);
          const newVersion = parseInt(object.metadata.resourceVersion, 10);
          if (currentVersion < newVersion) {
            Object.assign(existing, object);
          }
        } else {
          results[object.metadata.uid] = object;
        }

        break;
      }
      case 'DELETED':
        delete results[object.metadata.uid];
        break;
      case 'ERROR':
        console.error('Error in update', { type, object });
        break;
      default:
        console.error('Unknown update type', type);
    }

    push();
  }

  function push() {
    const values = Object.values(results);
    // Limit the number of resources to maxResources. We do this because when we're streaming, the
    // API server will send us all the resources that match the query, without limitting, even if the
    // API params wanted to limit it. So we do the limitting here.
    if (maxResources > 0 && values.length > maxResources) {
      values.sort((a, b) => {
        const aTime = new Date(a.lastTimestamp || a.metadata.creationTimestamp!).getTime();
        const bTime = new Date(b.lastTimestamp || b.metadata.creationTimestamp!).getTime();
        // Reverse sort, so we have the most recent resources at the beginning of the array.
        return 0 - (aTime - bTime);
      });
      values.splice(0, values.length - maxResources);
    }

    if (isDebugVerbose('k8s/apiProxy@push cb(values)')) {
      console.debug('k8s/apiProxy@push cb(values)', { values });
    }
    cb(values);
  }
}

/**
 * Configure a stream with... StreamArgs.
 */
export interface StreamArgs {
  /** Whether the stream is expected to receive JSON data. */
  isJson?: boolean;
  /** Additional WebSocket protocols to use when connecting. */
  additionalProtocols?: string[];
  /** A callback function to execute when the WebSocket connection is established. */
  connectCb?: () => void;
  /** Whether to attempt to reconnect the WebSocket connection if it fails. */
  reconnectOnFailure?: boolean;
  /** A callback function to execute when the WebSocket connection fails. */
  failCb?: () => void;
  tty?: boolean;
  stdin?: boolean;
  stdout?: boolean;
  stderr?: boolean;
}

/**
 * Establishes a WebSocket connection to the specified URL and streams the results
 * to the provided callback function.
 *
 * @param url - The URL to connect to.
 * @param cb - The callback function to receive the streamed results.
 * @param args - Additional arguments to configure the stream.
 *
 * @returns An object with two functions: `cancel`, which can be called to cancel
 * the stream, and `getSocket`, which returns the WebSocket object.
 */
export function stream(url: string, cb: StreamResultsCb, args: StreamArgs) {
  let connection: ReturnType<typeof connectStream>;
  let isCancelled = false;
  const { failCb } = args;
  // We only set reconnectOnFailure as true by default if the failCb has not been provided.
  const { isJson = false, additionalProtocols, connectCb, reconnectOnFailure = !failCb } = args;

  if (isDebugVerbose('k8s/apiProxy@stream')) {
    console.debug('k8s/apiProxy@stream', { url, args });
  }

  connect();

  return { cancel, getSocket };

  function getSocket() {
    return connection.socket;
  }

  function cancel() {
    if (connection) connection.close();
    isCancelled = true;
  }

  function connect() {
    if (connectCb) connectCb();
    connection = connectStream(url, cb, onFail, isJson, additionalProtocols);
  }

  function retryOnFail() {
    if (isCancelled) return;

    if (reconnectOnFailure) {
      if (isDebugVerbose('k8s/apiProxy@stream retryOnFail')) {
        console.debug('k8s/apiProxy@stream retryOnFail', 'Reconnecting in 3 seconds', { url });
      }

      setTimeout(connect, 3000);
    }
  }

  function onFail() {
    if (!!failCb) {
      failCb();
    }

    if (reconnectOnFailure) {
      retryOnFail();
    }
  }
}

/**
 * Connects to a WebSocket stream at the specified path and returns an object
 * with a `close` function and a `socket` property. Sends messages to `cb` callback.
 *
 * @param path - The path of the WebSocket stream to connect to.
 * @param cb - The function to call with each message received from the stream.
 * @param onFail - The function to call if the stream is closed unexpectedly.
 * @param isJson - Whether the messages should be parsed as JSON.
 * @param additionalProtocols - An optional array of additional WebSocket protocols to use.
 *
 * @returns An object with a `close` function and a `socket` property.
 */
function connectStream(
  path: string,
  cb: StreamResultsCb,
  onFail: () => void,
  isJson: boolean,
  additionalProtocols: string[] = []
) {
  let isClosing = false;

  // @todo: This is a temporary way of getting the current cluster. We should improve it later.
  const cluster = getCluster();
  const token = getToken(cluster || '');

  const protocols = ['base64.binary.k8s.io', ...additionalProtocols];
  if (token) {
    const encodedToken = btoa(token).replace(/=/g, '');
    protocols.push(`base64url.bearer.authorization.k8s.io.${encodedToken}`);
  }

  let fullPath = path;
  if (cluster) {
    fullPath = combinePath(`/${CLUSTERS_PREFIX}/${cluster}`, path);
  }

  const url = combinePath(BASE_WS_URL, fullPath);
  let socket: WebSocket | null = null;
  try {
    socket = new WebSocket(url, protocols);
    socket.binaryType = 'arraybuffer';
    socket.addEventListener('message', onMessage);
    socket.addEventListener('close', onClose);
    socket.addEventListener('error', onError);
  } catch (error) {
    console.error(error);
  }

  return { close, socket };

  function close() {
    isClosing = true;
    if (!socket) {
      return;
    }
    socket.close();
  }

  function onMessage(body: MessageEvent) {
    if (isClosing) return;

    const item = isJson ? JSON.parse(body.data) : body.data;
    if (isDebugVerbose('k8s/apiProxy@connectStream onMessage cb(item)')) {
      console.debug('k8s/apiProxy@connectStream onMessage cb(item)', { item });
    }

    cb(item);
  }

  function onClose(...args: any[]) {
    if (isClosing) return;
    isClosing = true;
    if (!socket) {
      return;
    }

    socket.removeEventListener('message', onMessage);
    socket.removeEventListener('close', onClose);
    socket.removeEventListener('error', onError);

    console.warn('Socket closed unexpectedly', { path, args });
    onFail();
  }

  function onError(err: any) {
    console.error('Error in api stream', { err, path });
  }
}

/**
 * Combines a base path and a path to create a full path.
 *
 * Doesn't matter if the start or the end has a single slash, the result will always have a single slash.
 *
 * @param base - The base path.
 * @param path - The path to combine with the base path.
 *
 * @returns The combined path.
 */
function combinePath(base: string, path: string) {
  if (base.endsWith('/')) base = base.slice(0, -1); // eslint-disable-line no-param-reassign
  if (path.startsWith('/')) path = path.slice(1); // eslint-disable-line no-param-reassign
  return `${base}/${path}`;
}

// @todo: apply() and other requests return Promise<any> Can we get it to return a better type?

/**
 * Applies the provided body to the Kubernetes API.
 *
 * Tries to POST, and if there's a conflict it does a PUT to the api endpoint.
 *
 * @param body - The kubernetes object body to apply.
 *
 * @returns The response from the kubernetes API server.
 */
export async function apply(body: KubeObjectInterface): Promise<JSON> {
  const bodyToApply = _.cloneDeep(body);

  let apiEndpoint;
  try {
    apiEndpoint = await resourceDefToApiFactory(bodyToApply);
  } catch (err) {
    console.error(`Error getting api endpoint when applying the resource ${bodyToApply}: ${err}`);
    throw err;
  }

  // Check if the default namespace is needed. And we need to do this before
  // getting the apiEndpoint because it will affect the endpoint itself.
  const isNamespaced = apiEndpoint.isNamespaced;
  const { namespace } = body.metadata;
  if (!namespace && isNamespaced) {
    let defaultNamespace = 'default';

    const cluster = getCluster();
    if (!!cluster) {
      defaultNamespace = getClusterDefaultNamespace(cluster) || 'default';
    }

    bodyToApply.metadata.namespace = defaultNamespace;
  }

  const resourceVersion = bodyToApply.metadata.resourceVersion;

  try {
    delete bodyToApply.metadata.resourceVersion;
    return await apiEndpoint.post(bodyToApply);
  } catch (err) {
    // Check to see if failed because the record already exists.
    // If the failure isn't a 409 (i.e. Confilct), just rethrow.
    if ((err as ApiError).status !== 409) throw err;

    // Preserve the resourceVersion if its an update request
    bodyToApply.metadata.resourceVersion = resourceVersion;
    // We had a conflict. Try a PUT
    return apiEndpoint.put(bodyToApply);
  }
}

export interface ApiError extends Error {
  status: number;
}

// @todo: is metrics() used anywhere? I can't find so, maybe in a plugin?

/**
 * Gets the metrics for the specified resource. Gets new metrics every 10 seconds.
 *
 * @param url - The url of the resource to get metrics for.
 * @param onMetrics - The function to call with the metrics.
 * @param onError - The function to call if there's an error.
 *
 * @returns A function to cancel the metrics request.
 */
export async function metrics(
  url: string,
  onMetrics: (arg: KubeMetrics[]) => void,
  onError?: (err: ApiError) => void
) {
  const handle = setInterval(getMetrics, 10000);

  async function getMetrics() {
    try {
      const metric = await request(url);
      onMetrics(metric.items || metric);
    } catch (err) {
      if (isDebugVerbose('k8s/apiProxy@metrics')) {
        console.debug('k8s/apiProxy@metrics', { err, url });
      }

      if (onError) {
        onError(err as ApiError);
      }
    }
  }

  function cancel() {
    clearInterval(handle);
  }

  getMetrics();

  return cancel;
}

export async function testAuth() {
  const spec = { namespace: 'default' };
  return post('/apis/authorization.k8s.io/v1/selfsubjectrulesreviews', { spec }, false, {
    timeout: 5 * 1000,
  });
}

export async function testClusterHealth() {
  return request('/healthz', { isJSON: false });
}

export async function setCluster(clusterReq: ClusterRequest) {
  return request(
    '/cluster',
    {
      method: 'POST',
      body: JSON.stringify(clusterReq),
      headers: { ...JSON_HEADERS, ...getHeadlampAPIHeaders() },
    },
    false,
    false
  );
}

export async function deleteCluster(cluster: string) {
  return request(
    `/cluster/${cluster}`,
    { method: 'DELETE', headers: { ...getHeadlampAPIHeaders() } },
    false,
    false
  );
}

// @todo: Move startPortForward, stopPortForward, and getPortForwardStatus to a portForward.ts

// @todo: the return type is missing for the following functions.
//       See PortForwardState in PortForward.tsx

/**
 * Starts a portforward with the given details.
 *
 * @param cluster - The cluster to portforward for.
 * @param namespace - The namespace to portforward for.
 * @param podname - The pod to portforward for.
 * @param containerPort - The container port to portforward for.
 * @param service - The service to portforward for.
 * @param serviceNamespace - The service namespace to portforward for.
 * @param port - The port to portforward for.
 * @param id - The id to portforward for.
 *
 * @returns The response from the API.
 * @throws {Error} if the request fails.
 */
export function startPortForward(
  cluster: string,
  namespace: string,
  podname: string,
  containerPort: number | string,
  service: string,
  serviceNamespace: string,
  port?: string,
  address: string = '',
  id: string = ''
) {
  return fetch(`${helpers.getAppUrl()}portforward`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${getToken(cluster)}`,
      ...JSON_HEADERS,
    }),
    body: JSON.stringify({
      cluster,
      namespace,
      pod: podname,
      service,
      targetPort: containerPort.toString(),
      serviceNamespace,
      id: id,
      address,
      port,
    }),
  }).then((response: Response) => {
    return response.json().then(data => {
      if (!response.ok) {
        throw new Error(data.message);
      }
      return data;
    });
  });
}

// @todo: stopOrDelete true is confusing, rename this param to justStop?
/**
 * Stops or deletes a portforward with the specified details.
 *
 * @param cluster - The cluster to portforward for.
 * @param id - The id to portforward for.
 * @param stopOrDelete - Whether to stop or delete the portforward. True for stop, false for delete.
 *
 * @returns The response from the API.
 * @throws {Error} if the request fails.
 */
export function stopOrDeletePortForward(cluster: string, id: string, stopOrDelete: boolean = true) {
  return fetch(`${helpers.getAppUrl()}portforward`, {
    method: 'DELETE',
    body: JSON.stringify({
      cluster,
      id,
      stopOrDelete,
    }),
  }).then(response =>
    response.text().then(data => {
      if (!response.ok) {
        throw new Error('Error deleting port forward');
      }
      return data;
    })
  );
}

/**
 * Lists the port forwards for the specified cluster.
 *
 * @param cluster - The cluster to list the port forwards.
 *
 * @returns the list of port forwards for the cluster.
 */
export function listPortForward(cluster: string) {
  return fetch(`${helpers.getAppUrl()}portforward/list?cluster=${cluster}`).then(response =>
    response.json()
  );
}

// @todo: Move drainNode and drainNodeStatus to a drainNode.ts

/**
 * Drain a node
 *
 * @param cluster - The cluster to drain the node
 * @param nodeName - The node name to drain
 *
 * @returns {Promise<JSON>}
 * @throws {Error} if the request fails
 * @throws {Error} if the response is not ok
 *
 * This function is used to drain a node. It is used in the node detail page.
 * As draining a node is a long running process, we get the request received
 * message if the request is successful. And then we poll the drain node status endpoint
 * to get the status of the drain node process.
 */
export function drainNode(cluster: string, nodeName: string) {
  return fetch(`${helpers.getAppUrl()}drain-node`, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${getToken(cluster)}`,
      ...JSON_HEADERS,
    }),
    body: JSON.stringify({
      cluster,
      nodeName,
    }),
  }).then(response => {
    return response.json().then(data => {
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      return data;
    });
  });
}

interface DrainNodeStatus {
  id: string;
  cluster: string;
}

/**
 * Get the status of the drain node process.
 *
 * It is used in the node detail page.
 * As draining a node is a long running process, we poll this endpoint to get
 * the status of the drain node process.
 *
 * @param cluster - The cluster to get the status of the drain node process for.
 * @param nodeName - The node name to get the status of the drain node process for.
 *
 * @returns - The response from the API.
 * @throws {Error} if the request fails
 * @throws {Error} if the response is not ok
 */
export function drainNodeStatus(cluster: string, nodeName: string): Promise<DrainNodeStatus> {
  return fetch(`${helpers.getAppUrl()}drain-node-status?cluster=${cluster}&nodeName=${nodeName}`, {
    method: 'GET',
    headers: new Headers({
      Authorization: `Bearer ${getToken(cluster)}`,
      ...JSON_HEADERS,
    }),
  }).then(response => {
    return response.json().then((data: DrainNodeStatus) => {
      if (!response.ok) {
        throw new Error('Something went wrong');
      }
      return data;
    });
  });
}

/** Gets the default namespace for the given cluster.
 * If the checkSettings parameter is true (default), it will check the cluster settings first.
 * Otherwise it will just check the cluster config. This means that if one needs the default
 * namespace that may come from the kubeconfig, call this function with the checkSettings parameter as false.
 *
 * @param cluster The cluster name.
 * @param checkSettings Whether to check the settings for the default namespace (otherwise it just checks the cluster config). Defaults to true.
 *
 * @returns The default namespace for the given cluster.
 */
function getClusterDefaultNamespace(cluster: string, checkSettings?: boolean): string {
  const includeSettings = checkSettings ?? true;
  let defaultNamespace = '';

  if (!!cluster) {
    if (includeSettings) {
      const clusterSettings = helpers.loadClusterSettings(cluster);
      defaultNamespace = clusterSettings?.defaultNamespace || '';
    }

    if (!defaultNamespace) {
      const state = store.getState();
      const clusterDefaultNs: string =
        state.config?.clusters?.[cluster]?.meta_data?.namespace || '';
      defaultNamespace = clusterDefaultNs;
    }
  }

  return defaultNamespace;
}

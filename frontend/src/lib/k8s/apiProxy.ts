/*
 * This module was originally taken from the K8dash project before modifications.
 *
 * K8dash is licensed under Apache License 2.0.
 *
 * Copyright © 2020 Eric Herbrandson
 * Copyright © 2020 Kinvolk GmbH
 */

import { OpPatch } from 'json-patch';
import { decodeToken } from 'react-jwt';
import helpers from '../../helpers';
import store from '../../redux/stores/store';
import { getToken, logout, setToken } from '../auth';
import { getCluster } from '../util';
import { KubeMetadata, KubeMetrics, KubeObjectInterface } from './cluster';
import { KubeToken } from './token';

const BASE_HTTP_URL = helpers.getAppUrl();
const BASE_WS_URL = BASE_HTTP_URL.replace('http', 'ws');
const CLUSTERS_PREFIX = 'clusters';
const JSON_HEADERS = { Accept: 'application/json', 'Content-Type': 'application/json' };
const DEFAULT_TIMEOUT = 2 * 60 * 1000; // ms
const MIN_LIFESPAN_FOR_TOKEN_REFRESH = 10; // sec

let isTokenRefreshInProgress = false;

export interface RequestParams {
  timeout?: number; // ms
  [prop: string]: any;
}

export interface ClusterRequest {
  /** The name of the cluster (has to be unique, or it will override an existing cluster) */
  name: string;
  /** The cluster URL */
  server: string;
  /** Whether the server's certificate should not be checked for validity */
  insecureTLSVerify?: boolean;
  /** The certificate authority data */
  certificateAuthorityData?: string;
}

//refreshToken checks if the token is about to expire and refreshes it if so.
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

  console.debug('Refreshing token');
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

// getClusterAuthType returns the auth type of the cluster.
function getClusterAuthType(cluster: string): string {
  const state = store.getState();
  const authType: string = state.config?.clusters?.[cluster]?.['auth_type'] || '';
  return authType;
}

export async function request(
  path: string,
  params: RequestParams = {},
  autoLogoutOnAuthError: boolean = true,
  useCluster: boolean = true
) {
  interface RequestHeaders {
    Authorization?: string;
    [otherHeader: string]: any;
  }

  const { timeout = DEFAULT_TIMEOUT, ...otherParams } = params;
  const opts: { headers: RequestHeaders } = Object.assign({ headers: {} }, otherParams);

  // @todo: This is a temporary way of getting the current cluster. We should improve it later.
  const cluster = getCluster();

  let fullPath = path;
  if (useCluster && cluster) {
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

  const url = combinePath(BASE_HTTP_URL, fullPath);
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

  if (!response.ok) {
    const { status, statusText } = response;
    if (autoLogoutOnAuthError && status === 401 && opts.headers.Authorization) {
      console.error('Logging out due to auth error', { status, statusText, path });
      logout();
    }

    let message = statusText;
    try {
      const json = await response.json();
      message += ` - ${json.message}`;
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

  return response.json();
}

export type StreamResultsCb = (...args: any[]) => void;
export type StreamErrCb = (err: Error & { status?: number }, cancelStreamFunc?: () => void) => void;

type ApiFactoryReturn = ReturnType<typeof apiFactory> | ReturnType<typeof apiFactoryWithNamespace>;

async function repeatStreamFunc(
  apiEndpoints: ApiFactoryReturn[],
  funcName: keyof ApiFactoryReturn,
  errCb: StreamErrCb,
  ...args: any[]
) {
  let isCancelled = false;
  let streamCancel = () => {};

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

export function apiFactory(
  ...args: Parameters<typeof singleApiFactory> | Parameters<typeof multipleApiFactory>
) {
  if (args[0] instanceof Array) {
    return multipleApiFactory(...(args as Parameters<typeof multipleApiFactory>));
  }

  return singleApiFactory(...(args as Parameters<typeof singleApiFactory>));
}

function multipleApiFactory(
  ...args: Parameters<typeof singleApiFactory>[]
): ReturnType<typeof singleApiFactory> {
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
  };
}

function singleApiFactory(group: string, version: string, resource: string) {
  const apiRoot = getApiRoot(group, version);
  const url = `${apiRoot}/${resource}`;
  return {
    list: (cb: StreamResultsCb, errCb: StreamErrCb) => streamResults(url, cb, errCb),
    get: (name: string, cb: StreamResultsCb, errCb: StreamErrCb) =>
      streamResult(url, name, cb, errCb),
    post: (body: KubeObjectInterface) => post(url, body),
    put: (body: KubeObjectInterface) => put(`${url}/${body?.metadata?.name}`, body),
    patch: (body: OpPatch[], name: string) => patch(`${url}/${name}?pretty=true`, body),
    delete: (name: string) => remove(`${url}/${name}`),
    isNamespaced: false,
  };
}

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
  };
}

function simpleApiFactoryWithNamespace(
  group: string,
  version: string,
  resource: string,
  includeScale: boolean = false
) {
  const apiRoot = getApiRoot(group, version);
  const results: {
    scale?: ReturnType<typeof apiScaleFactory>;
    [other: string]: any;
  } = {
    list: (namespace: string, cb: StreamResultsCb, errCb: StreamErrCb) =>
      streamResults(url(namespace), cb, errCb),
    get: (namespace: string, name: string, cb: StreamResultsCb, errCb: StreamErrCb) =>
      streamResult(url(namespace), name, cb, errCb),
    post: (body: KubeObjectInterface) => post(url(body?.metadata?.namespace as string), body),
    patch: (body: OpPatch[], namespace: string, name: string) =>
      patch(`${url(namespace)}/${name}?pretty=true`, body),
    put: (body: KubeObjectInterface) =>
      put(`${url(body?.metadata?.namespace as string)}/${body?.metadata?.name}`, body),
    delete: (namespace: string, name: string) => remove(`${url(namespace)}/${name}`),
    isNamespaced: true,
  };

  if (includeScale) {
    results.scale = apiScaleFactory(apiRoot, resource);
  }

  return results;

  function url(namespace: string) {
    return namespace ? `${apiRoot}/namespaces/${namespace}/${resource}` : `${apiRoot}/${resource}`;
  }
}

function resourceDefToApiFactory(resourceDef: KubeObjectInterface): ApiFactoryReturn {
  if (!resourceDef.kind) {
    throw new Error(`Cannot handle unknown resource kind: ${resourceDef.kind}`);
  }

  if (!resourceDef.apiVersion) {
    throw new Error(`Definition has no apiVersion`);
  }

  let factoryFunc: typeof apiFactory | typeof apiFactoryWithNamespace = apiFactory;
  if (!!resourceDef.metadata?.namespace) {
    factoryFunc = apiFactoryWithNamespace;
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

  // This may not be a great way to get the resource plural, but allows us to
  // skip checking the CRDs for it.
  const resourcePlural = resourceDef.kind.toLowerCase() + 's';
  return factoryFunc(apiGroup, apiVersion, resourcePlural);
}

function getApiRoot(group: string, version: string) {
  return group ? `/apis/${group}/${version}` : `api/${version}`;
}

function apiScaleFactory(apiRoot: string, resource: string) {
  return {
    get: (namespace: string, name: string) => request(url(namespace, name)),
    put: (body: { metadata: KubeMetadata; spec: { replicas: number } }) =>
      put(url(body.metadata.namespace as string, body.metadata?.name || ''), body),
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

export async function streamResult(
  url: string,
  name: string,
  cb: StreamResultsCb,
  errCb: StreamErrCb
) {
  let isCancelled = false;
  let socket: ReturnType<typeof stream>;
  run();

  return cancel;

  async function run() {
    try {
      const item = await request(`${url}/${name}`);

      if (isCancelled) return;
      cb(item);

      const fieldSelector = encodeURIComponent(`metadata.name=${name}`);
      const watchUrl = `${url}?watch=1&fieldSelector=${fieldSelector}`;

      socket = stream(watchUrl, x => cb(x.object), { isJson: true });
    } catch (err) {
      console.error('Error in api request', { err, url });
      if (errCb) errCb(err as ApiError, cancel);
    }
  }

  function cancel() {
    if (isCancelled) return;
    isCancelled = true;

    if (socket) socket.cancel();
  }
}

export async function streamResults(url: string, cb: StreamResultsCb, errCb: StreamErrCb) {
  const results: {
    [uid: string]: KubeObjectInterface;
  } = {};
  let isCancelled = false;
  let socket: ReturnType<typeof stream>;
  run();

  return cancel;

  async function run() {
    try {
      const { kind, items, metadata } = await request(url);

      if (isCancelled) return;

      add(items, kind);

      const watchUrl = `${url}?watch=1&resourceVersion=${metadata.resourceVersion}`;
      socket = stream(watchUrl, update, { isJson: true });
    } catch (err) {
      console.error('Error in api request', { err, url });
      if (errCb) errCb(err as ApiError, cancel);
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
      results[item.metadata?.uid || ''] = item;
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
        results[object.metadata?.uid || ''] = object;
        break;
      case 'MODIFIED': {
        const existing = results[object.metadata?.uid || ''];

        if (existing) {
          const currentVersion = parseInt(existing.metadata?.resourceVersion || '', 10);
          const newVersion = parseInt(object.metadata?.resourceVersion || '', 10);
          if (currentVersion < newVersion) {
            Object.assign(existing, object);
          }
        } else {
          results[object.metadata?.uid || ''] = object;
        }

        break;
      }
      case 'DELETED':
        delete results[object.metadata?.uid || ''];
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
    cb(values);
  }
}

export interface StreamArgs {
  isJson?: boolean;
  additionalProtocols?: string[];
  connectCb?: () => void;
  reconnectOnFailure?: boolean;
  failCb?: () => void;
}

export function stream(url: string, cb: StreamResultsCb, args: StreamArgs) {
  let connection: ReturnType<typeof connectStream>;
  let isCancelled = false;
  const { failCb } = args;
  // We only set reconnectOnFailure as true by default if the failCb has not been provided.
  const { isJson = false, additionalProtocols, connectCb, reconnectOnFailure = !!failCb } = args;

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
      console.log('Reconnecting in 3 seconds', { url });
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

  if (token) {
    const encodedToken = btoa(token).replace(/=/g, '');
    additionalProtocols.push(`base64url.bearer.authorization.k8s.io.${encodedToken}`);
  }

  const protocols = ['base64.binary.k8s.io', ...additionalProtocols];

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

function combinePath(base: string, path: string) {
  if (base.endsWith('/')) base = base.slice(0, -1); // eslint-disable-line no-param-reassign
  if (path.startsWith('/')) path = path.slice(1); // eslint-disable-line no-param-reassign
  return `${base}/${path}`;
}

export async function apply(body: KubeObjectInterface): Promise<JSON> {
  const apiEndpoint = resourceDefToApiFactory(body);

  try {
    return await apiEndpoint.post(body);
  } catch (err) {
    // Check to see if failed because the record already exists.
    // If the failure isn't a 409 (i.e. Confilct), just rethrow.
    if ((err as ApiError).status !== 409) throw err;

    // We had a conflict. Try a PUT
    return apiEndpoint.put(body);
  }
}

export interface ApiError extends Error {
  status: number;
}

export async function metrics(
  url: string,
  onMetrics: (arg: KubeMetrics[]) => void,
  onError?: (err: ApiError) => void
) {
  const handel = setInterval(getMetrics, 10000);

  async function getMetrics() {
    try {
      const metric = await request(url);
      onMetrics(metric.items || metric);
    } catch (err) {
      console.debug('No metrics', { err, url });

      if (onError) {
        onError(err as ApiError);
      }
    }
  }

  function cancel() {
    clearInterval(handel);
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

export async function setCluster(clusterReq: ClusterRequest) {
  return request(
    '/cluster',
    { method: 'POST', body: JSON.stringify(clusterReq), headers: JSON_HEADERS },
    false,
    false
  );
}

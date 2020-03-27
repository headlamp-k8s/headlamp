/*
 * This module was taken from the k8dash project.
 */

import { getToken, logout } from './auth';
import { getCluster } from './util';

const {host, href, hash, search} = window.location;
const nonHashedUrl = href.replace(hash, '').replace(search, '');
const isDev = process.env.NODE_ENV !== 'production';
const BASE_HTTP_URL = (isDev && host === 'localhost:3000' ? 'http://localhost:4654/' : nonHashedUrl);
const BASE_WS_URL = BASE_HTTP_URL.replace('http', 'ws');
const CLUSTERS_PREFIX = 'clusters';
const JSON_HEADERS = {Accept: 'application/json', 'Content-Type': 'application/json'};

export async function request(path, params, autoLogoutOnAuthError = true, useCluster=true) {
  const opts = Object.assign({headers: {}}, params);

  // @todo: This is a temporary way of getting the current cluster. We should improve it later.
  const cluster = getCluster();

  let fullPath = path;
  if (useCluster && cluster) {
    const token = getToken(cluster);
    if (!!token) {
      opts.headers.Authorization = `Bearer ${token}`;
    }

    fullPath = combinePath(`/${CLUSTERS_PREFIX}/${cluster}`, path);
  }

  const url = combinePath(BASE_HTTP_URL, fullPath);
  const response = await fetch(url, opts);

  if (!response.ok) {
    const {status, statusText} = response;
    if (autoLogoutOnAuthError && status === 401 && opts.headers.Authorization) {
      console.error('Logging out due to auth error', {status, statusText, path});
      logout();
    }

    let message = `Api request error: ${statusText}`;
    try {
      const json = await response.json();
      message += ` - ${json.message}`;
    } catch (err) {
      console.error('Unable to parse error json', {err});
    }

    const error = new Error(message);
    error.status = status;
    throw error;
  }

  return response.json();
}

export function apiFactory(group, version, resource) {
  const apiRoot = getApiRoot(group, version);
  const url = `${apiRoot}/${resource}`;
  return {
    resource: {group, resource},
    list: (cb, errCb) => streamResults(url, cb, errCb),
    get: (name, cb, errCb) => streamResult(url, name, cb, errCb),
    post: body => post(url, body),
    put: body => put(`${url}/${body.metadata.name}`, body),
    delete: name => remove(`${url}/${name}`),
  };
}

export function apiFactoryWithNamespace(group, version, resource, includeScale) {
  const apiRoot = getApiRoot(group, version);
  const results = {
    resource: {group, resource},
    list: (namespace, cb, errCb) => streamResults(url(namespace), cb, errCb),
    get: (namespace, name, cb, errCb) => streamResult(url(namespace), name, cb, errCb),
    post: body => post(url(body.metadata.namespace), body),
    put: body => put(`${url(body.metadata.namespace)}/${body.metadata.name}`, body),
    delete: (namespace, name) => remove(`${url(namespace)}/${name}`),
  };

  if (includeScale) {
    results.scale = apiScaleFactory(apiRoot, resource);
  }

  return results;

  function url(namespace) {
    return namespace ? `${apiRoot}/namespaces/${namespace}/${resource}` : `${apiRoot}/${resource}`;
  }
}

function getApiRoot(group, version) {
  return group ? `/apis/${group}/${version}` : `api/${version}`;
}

function apiScaleFactory(apiRoot, resource) {
  return {
    get: (namespace, name) => request(url(namespace, name)),
    put: body => put(url(body.metadata.namespace, body.metadata.name), body),
  };

  function url(namespace, name) {
    return `${apiRoot}/namespaces/${namespace}/${resource}/${name}/scale`;
  }
}

export function post(url, json, autoLogoutOnAuthError = true) {
  const body = JSON.stringify(json);
  const opts = {method: 'POST', body, headers: JSON_HEADERS};
  return request(url, opts, autoLogoutOnAuthError);
}

export function put(url, json, autoLogoutOnAuthError = true) {
  const body = JSON.stringify(json);
  const opts = {method: 'PUT', body, headers: JSON_HEADERS};
  return request(url, opts, autoLogoutOnAuthError);
}

export function remove(url) {
  const opts = {method: 'DELETE', headers: JSON_HEADERS};
  return request(url, opts);
}

export async function streamResult(url, name, cb, errCb) {
  let isCancelled = false;
  let socket;
  run();

  return cancel;

  async function run() {
    try {
      const item = await request(`${url}/${name}`);

      if (isCancelled) return;
      cb(item);

      const fieldSelector = encodeURIComponent(`metadata.name=${name}`);
      const watchUrl = `${url}?watch=1&fieldSelector=${fieldSelector}`;

      socket = stream(watchUrl, x => cb(x.object), {isJson: true});
    } catch (err) {
      console.error('Error in api request', {err, url});
      if (errCb) errCb(err);
    }
  }

  function cancel() {
    if (isCancelled) return;
    isCancelled = true;

    if (socket) socket.cancel();
  }
}

export async function streamResults(url, cb, errCb) {
  const results = {};
  let isCancelled = false;
  let socket;
  run();

  return cancel;

  async function run() {
    try {
      const {kind, items, metadata} = await request(url);

      if (isCancelled) return;

      add(items, kind);

      const watchUrl = `${url}?watch=1&resourceVersion=${metadata.resourceVersion}`;
      socket = stream(watchUrl, update, {isJson: true});
    } catch (err) {
      console.error('Error in api request', {err, url});
      if (errCb) errCb(err);
    }
  }

  function cancel() {
    if (isCancelled) return;
    isCancelled = true;

    if (socket) socket.cancel();
  }

  function add(items, kind) {
    const fixedKind = kind.slice(0, -4); // Trim off the word "List" from the end of the string
    for (const item of items) {
      item.kind = fixedKind;
      results[item.metadata.uid] = item;
    }

    push();
  }

  function update({type, object}) {
    object.actionType = type; // eslint-disable-line no-param-reassign

    switch (type) {
      case 'ADDED':
        results[object.metadata.uid] = object;
        break;
      case 'MODIFIED': {
        const existing = results[object.metadata.uid];

        if (existing) {
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
        console.error('Error in update', {type, object});
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

export function stream(url, cb, args) {
  let connection;
  let isCancelled;
  const {isJson, additionalProtocols, connectCb, reconnectOnFailure=true} = args;

  connect();

  return {cancel, getSocket};

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

  function onFail() {
    if (isCancelled) return;

    if (reconnectOnFailure) {
      console.log('Reconnecting in 3 seconds', {url});
      setTimeout(connect, 3000);
    }
  }
}

function connectStream(path, cb, onFail, isJson, additionalProtocols = []) {
  let isClosing = false;

  // @todo: This is a temporary way of getting the current cluster. We should improve it later.
  const cluster = getCluster();
  const token = getToken(cluster);
  const encodedToken = btoa(token).replace(/=/g, '');

  const protocols = [
    `base64url.bearer.authorization.k8s.io.${encodedToken}`,
    'base64.binary.k8s.io',
    ...additionalProtocols,
  ];

  let fullPath = path;
  if (cluster) {
    fullPath = combinePath(`/${CLUSTERS_PREFIX}/${cluster}`, path);
  }

  const url = combinePath(BASE_WS_URL, fullPath);
  const socket = new WebSocket(url, protocols);
  socket.binaryType = 'arraybuffer';
  socket.addEventListener('message', onMessage);
  socket.addEventListener('close', onClose);
  socket.addEventListener('error', onError);

  return {close, socket};

  function close() {
    isClosing = true;
    socket.close();
  }

  function onMessage(body) {
    if (isClosing) return;

    const item = isJson ? JSON.parse(body.data) : body.data;
    cb(item);
  }

  function onClose(...args) {
    if (isClosing) return;
    isClosing = true;

    socket.removeEventListener('message', onMessage);
    socket.removeEventListener('close', onClose);
    socket.removeEventListener('error', onError);

    console.warn('Socket closed unexpectedly', {path, args});
    onFail();
  }

  function onError(err) {
    console.error('Error in api stream', {err, path});
  }
}

function combinePath(base, path) {
  if (base.endsWith('/')) base = base.slice(0, -1); // eslint-disable-line no-param-reassign
  if (path.startsWith('/')) path = path.slice(1); // eslint-disable-line no-param-reassign
  return `${base}/${path}`;
}

/*
 * This module was originally taken from the K8dash project before modifications.
 *
 * K8dash is licensed under Apache License 2.0.
 *
 * Copyright © 2020 Eric Herbrandson
 * Copyright © 2020 Kinvolk GmbH
 */

import { Base64 } from 'js-base64';
import _ from 'lodash';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { setConfig } from '../../redux/actions/actions';
import { useTypedSelector } from '../../redux/reducers/reducers';
import { apiFactory, apiFactoryWithNamespace, post, request, stream, StreamResultsCb } from './apiProxy';
import { KubeMetrics, KubeObjectInterface, StringDict } from './cluster';

const configMap = apiFactoryWithNamespace('', 'v1', 'configmaps');
const event = apiFactoryWithNamespace('', 'v1', 'events');
const namespaceService = apiFactory('', 'v1', 'namespaces');
const node = apiFactory('', 'v1', 'nodes');
const persistentVolume = apiFactory('', 'v1', 'persistentvolumes');
const persistentVolumeClaim = apiFactoryWithNamespace('', 'v1', 'persistentvolumeclaims');
const pod = apiFactoryWithNamespace('', 'v1', 'pods');
const secret = apiFactoryWithNamespace('', 'v1', 'secrets');
const serviceAccount = apiFactoryWithNamespace('', 'v1', 'serviceaccounts');
const serviceService = apiFactoryWithNamespace('', 'v1', 'services');

const clusterRole = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterroles');
const clusterRoleBinding = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterrolebindings');
const role = apiFactoryWithNamespace('rbac.authorization.k8s.io', 'v1', 'roles');
const roleBinding = apiFactoryWithNamespace('rbac.authorization.k8s.io', 'v1', 'rolebindings');

const daemonSet = apiFactoryWithNamespace('apps', 'v1', 'daemonsets');
const deployment = apiFactoryWithNamespace('apps', 'v1', 'deployments', true);
const replicaSet = apiFactoryWithNamespace('apps', 'v1', 'replicasets', true);
const statefulSet = apiFactoryWithNamespace('apps', 'v1', 'statefulsets', true);

const cronJob = apiFactoryWithNamespace('batch', 'v1beta1', 'cronjobs');
const job = apiFactoryWithNamespace('batch', 'v1', 'jobs');

const ingress = apiFactoryWithNamespace('extensions', 'v1beta1', 'ingresses');

const storageClass = apiFactory('storage.k8s.io', 'v1', 'storageclasses');

const crd = apiFactory('apiextensions.k8s.io', 'v1beta1', 'customresourcedefinitions');

const apis: {
  [apiPoint: string]: any;
} = {
  apply,
  testAuth,
  getAuthorization,
  getRules,
  getVersion,
  getConfig,
  logs,
  swagger,
  exec,
  metrics: metricsFactory(),
  oidc: oidcFactory(),

  clusterRole,
  crd,
  namespace: namespaceService,
  node,
  persistentVolume,
  storageClass,
  clusterRoleBinding,
  configMap,
  cronJob,
  daemonSet,
  deployment,
  event,
  ingress,
  job,
  persistentVolumeClaim,
  pod,
  replicaSet,
  role,
  secret,
  service: serviceService,
  serviceAccount,
  statefulSet,
  roleBinding,
};

async function testAuth() {
  const spec = {namespace: 'default'};
  await post('/apis/authorization.k8s.io/v1/selfsubjectrulesreviews', {spec}, false);
}

function getVersion(): Promise<StringDict> {
  return request('/version');
}

async function getConfig() {
  return request('/config', {}, false, false) as Promise<{[prop: string]: string | number | any}>;
}

function getRules(namespace: string) {
  return post('/apis/authorization.k8s.io/v1/selfsubjectrulesreviews', {spec: {namespace}});
}

async function getAuthorization(resource: KubeObjectInterface, verb: string) {
  const resourceAttrs: {
    name: string;
    verb: string;
    namespace?: string;
  } = {
    name: resource.metadata.name,
    verb
  };

  if (resource.metadata.namespace) {
    resourceAttrs['namespace'] = resource.metadata.namespace;
  }

  const spec = {
    resourceAttributes: resourceAttrs
  };

  return await post('/apis/authorization.k8s.io/v1beta1/selfsubjectaccessreviews', {
    kind: 'SelfSubjectAccessReview',
    apiVersion: 'authorization.k8s.io/v1beta1',
    spec: spec
  },
    false);
}

async function apply(body: KubeObjectInterface) {
  const serviceName = _.camelCase(body.kind);
  const service = apis[serviceName];
  if (!service) {
    throw new Error(`No known service for kind: ${body.kind}`);
  }

  try {
    return await service.post(body);
  } catch (err) {
    // Check to see if failed because the record already exists.
    // If the failure isn't a 409 (i.e. Confilct), just rethrow.
    if (err.status !== 409) throw err;

    // We had a confilct. Try a PUT
    return service.put(body);
  }
}

type ApiListCb = (objsList: KubeObjectInterface[]) => void;
type ApiMetricsListCb = (objsList: KubeMetrics[]) => void;

function metricsFactory() {
  return {
    nodes: (cb: ApiMetricsListCb) => metrics('/apis/metrics.k8s.io/v1beta1/nodes', cb),
    node: (name: string, cb: ApiMetricsListCb) => metrics(`/apis/metrics.k8s.io/v1beta1/nodes/${name}`, cb),
    pods: (namespace: string, cb: ApiMetricsListCb) => metrics(url(namespace), cb),
    pod: (namespace: string, name: string, cb: ApiMetricsListCb) => metrics(`/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods/${name}`, cb),
  };

  function url(namespace: string) {
    return namespace ? `/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods` : '/apis/metrics.k8s.io/v1beta1/pods';
  }
}

function oidcFactory() {
  return {
    get: () => request('/oidc'),
    post: (code: string, redirectUri: string) => post('/oidc', {code, redirectUri}),
  };
}

async function metrics(url: string, cb: (arg: KubeMetrics[]) => void) {
  const handel = setInterval(getMetrics, 10000);
  getMetrics();

  async function getMetrics() {
    try {
      const metric = await request(url);
      cb(metric.items || metric);
    } catch (err) {
      console.error('No metrics', {err, url});
    }
  }

  return cancel;

  function cancel() {
    clearInterval(handel);
  }
}

function swagger() {
  return request('/openapi/v2');
}

interface ExecOptions {
  command?: string[];
  reconnectOnFailure?: boolean;
}

function exec(namespace: string, name: string, container: string, cb: StreamResultsCb,
              options: ExecOptions = {}) {
  const {command = ['sh'], reconnectOnFailure = undefined} = options;
  const commandStr = command.map(item => '&command=' + encodeURIComponent(item)).join('');
  const url = `/api/v1/namespaces/${namespace}/pods/${name}/exec?container=${container}${commandStr}&stdin=1&stderr=1&stdout=1&tty=1`;
  const additionalProtocols = ['v4.channel.k8s.io', 'v3.channel.k8s.io', 'v2.channel.k8s.io', 'channel.k8s.io'];
  return stream(url, cb, {additionalProtocols, isJson: false, reconnectOnFailure});
}

function logs(namespace: string, name: string, container: string, tailLines: number,
              showPrevious: boolean, cb: StreamResultsCb) {
  const items: string[] = [];
  const url = `/api/v1/namespaces/${namespace}/pods/${name}/log?container=${container}&previous=${showPrevious}&tailLines=${tailLines}&follow=true`;
  const {cancel} = stream(url, transformer, {isJson: false, connectCb});
  return cancel;

  function connectCb() {
    items.length = 0;
  }

  function transformer(item: string) {
    if (!item) return; // For some reason, this api returns a lot of empty strings

    const message = Base64.decode(item);
    items.push(message);
    cb(items);
  }
}

type CancellablePromise = Promise<() => void>;

// Hook for managing API connections in a shared and coherent way.
export function useConnectApi(...apiCalls: (() => CancellablePromise)[]) {
  // Use the location to make sure the API calls are changed, as they may depend on the cluster
  // (defined in the URL ATM).
  // @todo: Update this if the active cluster management is changed.
  const location = useLocation();

  React.useEffect(() => {
    const cancellables = apiCalls.map(func => func());

    return function cleanup() {
      for (const cancellablePromise of cancellables) {
        cancellablePromise.then(cancellable => cancellable());
      }
    };
  },
    // If we add the apiCalls to the dependency list, then it actually
    // results in undesired reloads.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location]);
}

// Hook for getting or fetching the clusters configuration.
export function useClustersConf() {
  const dispatch = useDispatch();
  const clusters = useTypedSelector(state => state.config.clusters);

  React.useEffect(() => {
    if (clusters.length === 0) {
      getConfig()
        .then((config: object) => {
          dispatch(setConfig(config));
        })
        .catch((err: Error) => console.error(err));
      return;
    }
  },
  [clusters, dispatch]);

  return clusters;
}

export default apis;

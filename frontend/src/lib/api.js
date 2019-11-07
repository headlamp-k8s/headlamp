/*
 * This module was taken from the k8dash project.
 */

import {Base64} from 'js-base64';
import _ from 'lodash';
import {apiFactory, apiFactoryWithNamespace,post, request, stream} from './apiProxy';

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

const apis = {
  apply,
  testAuth,
  getRules,
  logs,
  swagger,
  exec,
  metrics: metricsFactory(),
  oidc: oidcFactory(),

  clusterRole,
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

function getRules(namespace) {
  return post('/apis/authorization.k8s.io/v1/selfsubjectrulesreviews', {spec: {namespace}});
}

async function apply(body) {
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

function metricsFactory() {
  return {
    nodes: cb => metrics('/apis/metrics.k8s.io/v1beta1/nodes', cb),
    node: (name, cb) => metrics(`/apis/metrics.k8s.io/v1beta1/nodes/${name}`, cb),
    pods: (namespace, cb) => metrics(url(namespace), cb),
    pod: (namespace, name, cb) => metrics(`/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods/${name}`, cb),
  };

  function url(namespace) {
    return namespace ? `/apis/metrics.k8s.io/v1beta1/namespaces/${namespace}/pods` : '/apis/metrics.k8s.io/v1beta1/pods';
  }
}

function oidcFactory() {
  return {
    get: () => request('/oidc'),
    post: (code, redirectUri) => post('/oidc', {code, redirectUri}),
  };
}

function metrics(url, cb) {
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

function exec(namespace, name, container, cb) {
  const url = `/api/v1/namespaces/${namespace}/pods/${name}/exec?container=${container}&command=sh&stdin=1&stderr=1&stdout=1&tty=1`;
  const additionalProtocols = ['v4.channel.k8s.io', 'v3.channel.k8s.io', 'v2.channel.k8s.io', 'channel.k8s.io'];
  return stream(url, cb, {additionalProtocols, isJson: false});
}

function logs(namespace, name, container, tailLines, showPrevious, cb) {
  const items = [];
  const url = `/api/v1/namespaces/${namespace}/pods/${name}/log?container=${container}&previous=${showPrevious}&tailLines=${tailLines}&follow=true`;
  const {cancel} = stream(url, transformer, {isJson: false, connectCb});
  return cancel;

  function connectCb() {
    items.length = 0;
  }

  function transformer(item) {
    if (!item) return; // For some reason, this api returns a lot of empty strings

    const message = Base64.decode(item);
    items.push(message);
    cb(items);
  }
}

export default apis;

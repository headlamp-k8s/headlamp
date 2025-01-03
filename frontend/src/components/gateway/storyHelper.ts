import { KubeGateway } from '../../lib/k8s/gateway';
import { KubeGatewayClass } from '../../lib/k8s/gatewayClass';
import { KubeGRPCRoute } from '../../lib/k8s/grpcRoute';
import { KubeHTTPRoute } from '../../lib/k8s/httpRoute';

export const DEFAULT_GATEWAY: KubeGateway = {
  apiVersion: 'gateway.networking.k8s.io/v1beta1',
  kind: 'Gateway',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'default-gateway',
    namespace: 'default',
    resourceVersion: '12345',
    uid: 'abc123',
  },
  spec: {
    gatewayClassName: 'test',
    listeners: [
      {
        hostname: 'test',
        name: 'test',
        protocol: 'HTTP',
        port: 80,
      },
    ],
  },
  status: {
    addresses: [],
    listeners: [],
  },
};

export const DEFAULT_GATEWAY_CLASS: KubeGatewayClass = {
  apiVersion: 'gateway.networking.k8s.io/v1beta1',
  kind: 'GatewayClass',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'default-gateway-class',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc1234',
  },
  spec: {
    controllerName: 'test',
  },
  status: {},
};

export const DEFAULT_HTTP_ROUTE: KubeHTTPRoute = {
  apiVersion: 'gateway.networking.k8s.io/v1beta1',
  kind: 'HTTPRoute',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'default-httproute',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc1234',
  },
  spec: {
    hostnames: ['test'],
    parentRefs: [],
    rules: [
      {
        name: 'test',
        backendRefs: [],
        matches: [],
      },
      {
        matches: [],
      },
      {
        backendRefs: [],
      },
    ],
  },
};

export const DEFAULT_GRPC_ROUTE: KubeGRPCRoute = {
  apiVersion: 'gateway.networking.k8s.io/v1beta1',
  kind: 'GRPCRoute',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'default-httproute',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc1234',
  },
  spec: {
    parentRefs: [
      {
        group: 'gateway.networking.k8s.io',
        kind: 'Gateway',
        namespace: 'shared-gateway',
        name: 'envoy-gateway-system',
      },
      {
        group: 'gateway.networking.k8s.io',
        kind: 'Gateway',
        namespace: 'shared-gateway',
        sectionName: 'test',
        name: 'envoy-gateway-system-test',
      },
    ],
  },
};

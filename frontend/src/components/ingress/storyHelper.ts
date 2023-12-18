export const PORT_INGRESS = {
  apiVersion: 'networking.k8s.io/v1',
  kind: 'Ingress',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'tls-example-ingress',
    namespace: 'default',
    resourceVersion: '12345',
    uid: 'abc123',
  },
  spec: {
    rules: [
      {
        host: 'https-example.foo.com',
        http: {
          paths: [
            {
              backend: {
                service: {
                  name: 'service1',
                  port: {
                    number: 80,
                  },
                },
              },
              path: '/',
              pathType: 'Prefix',
            },
            {
              backend: {
                service: {
                  name: 'service2',
                  port: {
                    name: 'someport',
                  },
                },
              },
              path: '/second',
              pathType: 'Prefix',
            },
          ],
        },
      },
    ],
    tls: [
      {
        hosts: ['https-example.foo.com'],
        secretName: 'testsecret-tls',
      },
    ],
  },
  status: {
    loadBalancer: {},
  },
};

export const RESOURCE_INGRESS = {
  apiVersion: 'networking.k8s.io/v1',
  kind: 'Ingress',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'resource-example-ingress',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc1234',
  },
  spec: {
    rules: [
      {
        host: 'https-example.foo.com',
        http: {
          paths: [
            {
              backend: {
                resource: {
                  apiVersion: 'v1',
                  kind: 'Service',
                  name: 'service1',
                },
              },
              path: '/',
              pathType: 'Prefix',
            },
          ],
        },
      },
    ],
  },
  status: {
    loadBalancer: {},
  },
};

export const RESOURCE_INGRESS_CLASS = {
  apiVersion: 'networking.k8s.io/v1',
  kind: 'IngressClass',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'resource-example-ingress',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc1234',
  },
  spec: {
    controller: 'test',
  },
};

export const RESOURCE_DEFAULT_INGRESS_CLASS = {
  apiVersion: 'networking.k8s.io/v1',
  kind: 'IngressClass',
  metadata: {
    creationTimestamp: '2023-07-19T09:48:42Z',
    generation: 1,
    name: 'resource-example-ingress',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc1234',
    annotations: {
      'ingressclass.kubernetes.io/is-default-class': 'true',
    },
  },
  spec: {
    controller: 'test',
  },
};

import { KubeRuntimeClass } from '../../lib/k8s/runtime';
const creationTimestamp = new Date('2022-01-01').toISOString();

export const BASE_RC: KubeRuntimeClass = {
  apiVersion: 'node.k8s.io/v1',
  kind: 'RuntimeClass',
  metadata: {
    name: 'runtime-class',
    namespace: 'default',
    creationTimestamp,
    uid: '123',
  },
  handler: 'handler',
  overhead: {
    cpu: '100m',
    memory: '128Mi',
  },
  scheduling: {
    nodeSelector: {
      key: 'value',
    },
    tolerations: [
      {
        key: 'key',
        operator: 'Equal',
        value: 'value',
        effect: 'NoSchedule',
        tolerationSeconds: 10,
      },
    ],
  },
};

export const RUNTIME_CLASS_DUMMY_DATA: KubeRuntimeClass[] = [
  {
    apiVersion: 'node.k8s.io/v1',
    kind: 'RuntimeClass',
    metadata: {
      name: 'runtime-class',
      namespace: 'default',
      creationTimestamp,
      uid: '123',
    },
    handler: 'handler',
    overhead: {
      cpu: '100m',
      memory: '128Mi',
    },
    scheduling: {
      nodeSelector: {
        key: 'value',
      },
      tolerations: [
        {
          key: 'key',
          operator: 'Equal',
          value: 'value',
          effect: 'NoSchedule',
          tolerationSeconds: 10,
        },
      ],
    },
  },
];

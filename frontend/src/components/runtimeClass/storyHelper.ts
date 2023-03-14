export const RUNTIME_CLASS_DUMMY_DATA = [
  {
    apiVersion: 'node.k8s.io/v1',
    kind: 'RuntimeClass',
    metadata: {
      name: 'runtime-class',
      namespace: 'default',
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

const creationTimestamp = new Date('2022-01-01').toISOString();

export const LIMIT_RANGE_DUMMY_DATA = [
  {
    apiVersion: 'v1',
    kind: 'LimitRange',
    metadata: {
      name: 'limit-range',
      namespace: 'default',
      creationTimestamp,
      uid: '123',
    },
    spec: {
      limits: [
        {
          default: {
            cpu: '100m',
            memory: '128Mi',
          },
          defaultRequest: {
            cpu: '50m',
            memory: '64Mi',
          },
          max: {
            cpu: '500m',
            memory: '1Gi',
          },
          min: {
            cpu: '10m',
            memory: '4Mi',
          },
          type: 'Container',
        },
      ],
    },
  },
];

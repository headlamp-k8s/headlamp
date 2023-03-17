const creationTimestamp = new Date('2022-01-01').toISOString();

export const LEASE_DUMMY_DATA = [
  {
    apiVersion: 'coordination.k8s.io/v1',
    kind: 'Lease',
    metadata: {
      name: 'lease',
      namespace: 'default',
      creationTimestamp,
      uid: '123',
    },
    spec: {
      holderIdentity: 'holder',
      leaseDurationSeconds: 10,
      leaseTransitions: 1,
      renewTime: '2021-03-01T00:00:00Z',
    },
  },
];

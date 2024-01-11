import { KubeSecret } from '../../lib/k8s/secret';

export const BASE_SECRET: KubeSecret = {
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  data: {
    storageClassName: 'default',
    volumeMode: 'Filesystem',
    volumeName: 'pvc-abc-1234',
  },
  type: 'test',
};

export const BASE_EMPTY_SECRET: KubeSecret = {
  apiVersion: 'v1',
  kind: 'Secret',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  data: {},
  type: 'bla',
};

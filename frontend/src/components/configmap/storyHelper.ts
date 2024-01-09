import { KubeConfigMap } from '../../lib/k8s/configMap';

export const BASE_CONFIG_MAP: KubeConfigMap = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
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
};

export const BASE_EMPTY_CONFIG_MAP: KubeConfigMap = {
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  data: {},
};

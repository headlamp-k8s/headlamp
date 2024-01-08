import { KubePersistentVolume } from '../../lib/k8s/persistentVolume';
import { KubePersistentVolumeClaim } from '../../lib/k8s/persistentVolumeClaim';

export const BASE_PVC: KubePersistentVolumeClaim = {
  apiVersion: 'v1',
  kind: 'PersistentVolumeClaim',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    finalizers: ['kubernetes.io/pvc-protection'],
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  spec: {
    accessModes: ['ReadWriteOnce'],
    resources: {
      requests: {
        storage: '8Gi',
      },
    },
    storageClassName: 'default',
    volumeMode: 'Filesystem',
    volumeName: 'pvc-abc-1234',
  },
  status: {
    accessModes: ['ReadWriteOnce'],
    capacity: {
      storage: '8Gi',
    },
    phase: 'Bound',
  },
};

export const BASE_PV: KubePersistentVolume = {
  apiVersion: 'v1',
  kind: 'PersistentVolume',
  metadata: {
    creationTimestamp: '2023-04-27T20:31:27Z',
    finalizers: ['kubernetes.io/pvc-protection'],
    name: 'my-pvc',
    namespace: 'default',
    resourceVersion: '1234',
    uid: 'abc-1234',
  },
  spec: {
    capacity: {
      storage: '8Gi',
    },
    accessModes: ['ReadWriteOnce'],
    storageClassName: 'default',
    volumeMode: 'Filesystem',
  },
  status: {
    message: 'test',
    phase: 'Bound',
    reason: 'test',
  },
};

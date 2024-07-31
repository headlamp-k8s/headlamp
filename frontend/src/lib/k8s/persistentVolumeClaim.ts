import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './cluster';

export interface KubePersistentVolumeClaim extends KubeObjectInterface {
  spec?: {
    accessModes?: string[];
    resources?: {
      limits?: object;
      requests: {
        storage?: string;
        [other: string]: any;
      };
    };
    storageClassName?: string;
    volumeMode?: string;
    volumeName?: string;
    [other: string]: any;
  };
  status?: {
    capacity?: {
      storage?: string;
    };
    phase?: string;
    accessModes?: string[];
    [other: string]: any;
  };
}

class PersistentVolumeClaim extends KubeObject<KubePersistentVolumeClaim> {
  static objectName = 'persistentVolumeClaim';
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'persistentvolumeclaims');

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }
}

export default PersistentVolumeClaim;

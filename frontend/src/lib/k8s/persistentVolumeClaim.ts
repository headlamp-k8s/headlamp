import { KubeObject, KubeObjectInterface } from './KubeObject';

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
  static kind = 'PersistentVolumeClaim';
  static apiName = 'persistentvolumeclaims';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static getBaseObject(): KubePersistentVolumeClaim {
    const baseObject = super.getBaseObject() as KubePersistentVolumeClaim;
    baseObject.metadata = {
      ...baseObject.metadata,
      namespace: '',
    };
    baseObject.spec = {
      storageClassName: '',
      volumeName: '',
    };
    return baseObject;
  }

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }
}

export default PersistentVolumeClaim;

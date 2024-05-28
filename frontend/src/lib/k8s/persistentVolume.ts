import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubePersistentVolume extends KubeObjectInterface {
  spec: {
    capacity: {
      storage: string;
    };
    [other: string]: any;
  };
  status: {
    message: string;
    phase: string;
    reason: string;
  };
}

class PersistentVolume extends KubeObject<KubePersistentVolume> {
  static kind = 'PersistentVolume';
  static apiName = 'persistentvolumes';
  static apiVersion = 'v1';
  static isNamespaced = false;

  static getBaseObject(): KubePersistentVolume {
    const baseObject = super.getBaseObject() as KubePersistentVolume;
    baseObject.metadata = {
      ...baseObject.metadata,
      namespace: '',
    };
    baseObject.spec = {
      capacity: {
        storage: '',
      },
    };
    baseObject.status = {
      message: '',
      phase: '',
      reason: '',
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

export default PersistentVolume;

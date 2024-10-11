import { KubeObjectInterface, makeKubeObject } from './cluster';

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

class PersistentVolume extends makeKubeObject<KubePersistentVolume>() {
  static kind = 'PersistentVolume';
  static apiName = 'persistentvolumes';
  static apiVersion = 'v1';
  static isNamespaced = false;

  get spec() {
    return this.jsonData?.spec;
  }

  get status() {
    return this.jsonData?.status;
  }
}

export default PersistentVolume;

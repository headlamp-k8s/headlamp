import { apiFactory } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './cluster';

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
  static objectName = 'persistentVolume';
  static apiEndpoint = apiFactory('', 'v1', 'persistentvolumes');

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }
}

export default PersistentVolume;

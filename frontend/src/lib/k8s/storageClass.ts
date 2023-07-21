import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeStorageClass extends KubeObjectInterface {
  provisioner: string;
  reclaimPolicy: string;
  volumeBindingMode: string;
}

class StorageClass extends makeKubeObject<KubeStorageClass>('storageClass') {
  static apiEndpoint = apiFactory('storage.k8s.io', 'v1', 'storageclasses');

  get provisioner() {
    return this.jsonData?.provisioner;
  }

  get reclaimPolicy() {
    return this.jsonData?.reclaimPolicy;
  }

  get volumeBindingMode() {
    return this.jsonData?.volumeBindingMode;
  }

  static get listRoute() {
    return 'storageClasses';
  }

  static get pluralName() {
    return 'storageclasses';
  }
}

export default StorageClass;

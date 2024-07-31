import { apiFactory } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './cluster';

export interface KubeStorageClass extends KubeObjectInterface {
  provisioner: string;
  reclaimPolicy: string;
  volumeBindingMode: string;
  allowVolumeExpansion?: boolean;
}

class StorageClass extends KubeObject<KubeStorageClass> {
  static objectName = 'storageClass';
  static apiEndpoint = apiFactory('storage.k8s.io', 'v1', 'storageclasses');

  get provisioner() {
    return this.jsonData.provisioner;
  }

  get reclaimPolicy() {
    return this.jsonData.reclaimPolicy;
  }

  get volumeBindingMode() {
    return this.jsonData.volumeBindingMode;
  }

  get allowVolumeExpansion() {
    return this.jsonData.allowVolumeExpansion;
  }

  static get listRoute() {
    return 'storageClasses';
  }

  static get pluralName() {
    return 'storageclasses';
  }
}

export default StorageClass;

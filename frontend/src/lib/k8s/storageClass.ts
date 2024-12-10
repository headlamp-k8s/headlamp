import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeStorageClass extends KubeObjectInterface {
  provisioner: string;
  reclaimPolicy: string;
  volumeBindingMode: string;
  allowVolumeExpansion?: boolean;
}

class StorageClass extends KubeObject<KubeStorageClass> {
  static kind = 'StorageClass';
  static apiName = 'storageclasses';
  static apiVersion = 'storage.k8s.io/v1';
  static isNamespaced = false;

  static getBaseObject(): KubeStorageClass {
    const baseObject = super.getBaseObject() as KubeStorageClass;
    baseObject.provisioner = '';
    baseObject.reclaimPolicy = '';
    baseObject.volumeBindingMode = '';
    baseObject.allowVolumeExpansion = false;
    return baseObject;
  }

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

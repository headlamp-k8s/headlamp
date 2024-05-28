import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeRuntimeClass extends KubeObjectInterface {
  handler: string;
}

export class RuntimeClass extends makeKubeObject<KubeRuntimeClass>('RuntimeClass') {
  static apiEndpoint = apiFactory('node.k8s.io', 'v1', 'runtimeclasses');

  static getBaseObject(): KubeRuntimeClass {
    const baseObject = super.getBaseObject() as KubeRuntimeClass;
    baseObject.handler = '';
    return baseObject;
  }

  get spec() {
    return this.jsonData!.spec;
  }

  static get pluralName() {
    return 'runtimeclasses';
  }

  static get listRoute() {
    return this.pluralName;
  }
}

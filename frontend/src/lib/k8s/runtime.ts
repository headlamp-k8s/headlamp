import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeRuntimeClass extends KubeObjectInterface {
  handler: string;
}

export class RuntimeClass extends makeKubeObject<KubeRuntimeClass>('RuntimeClass') {
  static apiEndpoint = apiFactory('node.k8s.io', 'v1', 'runtimeclasses');

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

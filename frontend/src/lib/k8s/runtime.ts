import { apiFactory } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './cluster';

export interface KubeRuntimeClass extends KubeObjectInterface {
  handler: string;
  overhead?: any;
  scheduling?: any;
}

export class RuntimeClass extends KubeObject<KubeRuntimeClass> {
  static objectName = 'RuntimeClass';
  static apiEndpoint = apiFactory('node.k8s.io', 'v1', 'runtimeclasses');

  get spec() {
    return this.jsonData.spec;
  }

  static get pluralName() {
    return 'runtimeclasses';
  }

  static get listRoute() {
    return this.pluralName;
  }
}

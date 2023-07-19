import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeObject extends KubeObjectInterface {
  handler: string;
}

export class RuntimeClass extends makeKubeObject<KubeObject>('runtimeClass') {
  static apiEndpoint = apiFactoryWithNamespace('node.k8s.io', 'v1', 'runtimeclasses');

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

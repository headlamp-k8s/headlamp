import { apiFactory } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeRuntimeClass extends KubeObjectInterface {
  handler: string;
  overhead?: any;
  scheduling?: any;
}

export class RuntimeClass extends KubeObject<KubeRuntimeClass> {
  static kind = 'RuntimeClass';
  static apiName = 'runtimeclasses';
  static apiVersion = 'node.k8s.io/v1';
  static isNamespaced = false;

  static apiEndpoint = apiFactory('node.k8s.io', 'v1', 'runtimeclasses');

  get spec() {
    return this.jsonData.spec;
  }
}

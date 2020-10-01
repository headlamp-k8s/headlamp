import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeCRD extends KubeObjectInterface {
  spec: {
    group: string;
    version: string;
    versions: {
      name: string;
      served: boolean;
      storage: boolean;
    };
    scope: string;
    [other: string]: any;
  };
}

class CustomResourceDefinition extends makeKubeObject<KubeCRD>('crd') {
  static apiEndpoint = apiFactory('apiextensions.k8s.io', 'v1beta1', 'customresourcedefinitions');

  static get className(): string {
    return 'CustomResourceDefinition';
  }

  get spec() {
    return this.jsonData!.spec;
  }
}

export default CustomResourceDefinition;

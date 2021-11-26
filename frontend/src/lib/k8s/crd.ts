import { createRouteURL } from '../router';
import { apiFactory, apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeCRD extends KubeObjectInterface {
  spec: {
    group: string;
    version: string;
    versions: {
      name: string;
      served: boolean;
      storage: boolean;
      additionalPrinterColumns: {
        name: string;
        type: string;
        jsonPath: string;
        description?: string;
        priority?: number;
      }[];
    }[];
    scope: string;
    [other: string]: any;
  };
}

class CustomResourceDefinition extends makeKubeObject<KubeCRD>('crd') {
  static apiEndpoint = apiFactory(
    ['apiextensions.k8s.io', 'v1', 'customresourcedefinitions'],
    ['apiextensions.k8s.io', 'v1beta1', 'customresourcedefinitions']
  );

  static get className(): string {
    return 'CustomResourceDefinition';
  }

  get listRoute(): string {
    return 'crds';
  }

  get detailsRoute(): string {
    return createRouteURL('crd', { name: this.jsonData!.metadata.name });
  }

  get spec() {
    return this.jsonData!.spec;
  }
}

export function makeCustomResourceClass(
  args: [group: string, version: string, pluralName: string][],
  isNamespaced: boolean
) {
  const apiFunc = !!isNamespaced ? apiFactoryWithNamespace : apiFactory;
  return class CRClass extends makeKubeObject<KubeCRD>('crd') {
    static apiEndpoint = apiFunc(...args);
  };
}

export default CustomResourceDefinition;

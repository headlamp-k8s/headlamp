import { ResourceClasses } from '.';
import { apiFactory, apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeCRD extends KubeObjectInterface {
  spec: {
    group: string;
    version: string;
    names: {
      plural: string;
      singular: string;
      kind: string;
      listKind: string;
    };
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
        format?: string;
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

  static get detailsRoute(): string {
    return 'crd';
  }

  get spec() {
    return this.jsonData!.spec;
  }

  get plural(): string {
    return this.spec().names.plural;
  }
}

export function makeCustomResourceClass(
  args: [group: string, version: string, pluralName: string][],
  isNamespaced: boolean
) {
  // Used for tests
  const knownClass = ResourceClasses[args[0][2]];
  if (!!knownClass) {
    return knownClass;
  }

  const apiFunc = !!isNamespaced ? apiFactoryWithNamespace : apiFactory;
  return class CRClass extends makeKubeObject<KubeCRD>('crd') {
    static apiEndpoint = apiFunc(...args);
  };
}

export default CustomResourceDefinition;

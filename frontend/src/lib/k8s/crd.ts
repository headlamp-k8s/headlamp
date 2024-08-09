import { ResourceClasses } from '.';
import { apiFactory, apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectClass, KubeObjectInterface } from './cluster';

export interface KubeCRD extends KubeObjectInterface {
  spec: {
    group: string;
    version: string;
    names: {
      plural: string;
      singular: string;
      kind: string;
      listKind: string;
      categories?: string[];
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
  status?: {
    acceptedNames?: {
      kind: string;
      plural: string;
      shortNames: string[];
      categories?: string[];
    };
    conditions?: {
      type: string;
      status: string;
      lastTransitionTime: string;
      reason: string;
      message: string;
    }[];
    storedVersions?: string[];
  };
}

class CustomResourceDefinition extends KubeObject<KubeCRD> {
  static objectName = 'crd';
  static apiEndpoint = apiFactory(
    ['apiextensions.k8s.io', 'v1', 'customresourcedefinitions'],
    ['apiextensions.k8s.io', 'v1beta1', 'customresourcedefinitions']
  );
  static readOnlyFields = ['metadata.managedFields'];

  static get className(): string {
    return 'CustomResourceDefinition';
  }

  static get detailsRoute(): string {
    return 'crd';
  }

  get spec(): KubeCRD['spec'] {
    return this.jsonData.spec;
  }

  get status(): KubeCRD['status'] {
    return this.jsonData.status;
  }

  get plural(): string {
    return this.spec.names.plural;
  }

  getMainAPIGroup(): [string, string, string] {
    const group = this.spec.group;
    let version = this.spec.version;
    const name = this.spec.names.plural as string;

    // Assign the 1st storage version if no version is specified,
    // or the 1st served version if no storage version is specified.
    if (!version && this.spec.versions.length > 0) {
      for (const versionItem of this.spec.versions) {
        if (!!versionItem.storage) {
          version = versionItem.name;
        } else if (!version) {
          version = versionItem.name;
        }
      }
    }

    return [group, version, name];
  }

  get isNamespacedScope(): boolean {
    return this.spec.scope === 'Namespaced';
  }

  makeCRClass(): typeof KubeObject<KubeCRD> {
    const apiInfo: CRClassArgs['apiInfo'] = (this.jsonData as KubeCRD).spec.versions.map(
      versionInfo => ({ group: this.spec.group, version: versionInfo.name })
    );

    return makeCustomResourceClass({
      apiInfo,
      isNamespaced: this.spec.scope === 'Namespaced',
      singularName: this.spec.names.singular,
      pluralName: this.spec.names.plural,
    });
  }

  getCategories() {
    return this.status?.acceptedNames?.categories ?? [];
  }
}

export interface CRClassArgs {
  apiInfo: {
    group: string;
    version: string;
  }[];
  pluralName: string;
  singularName: string;
  isNamespaced: boolean;
}

/** @deprecated Use the version of the function that receives an object as its argument. */
export function makeCustomResourceClass(
  args: [group: string, version: string, pluralName: string][],
  isNamespaced: boolean
): KubeObjectClass;
export function makeCustomResourceClass(args: CRClassArgs): KubeObjectClass;
export function makeCustomResourceClass(
  args: [group: string, version: string, pluralName: string][] | CRClassArgs,
  isNamespaced?: boolean
): KubeObjectClass {
  let apiInfoArgs: [group: string, version: string, pluralName: string][] = [];

  if (Array.isArray(args)) {
    apiInfoArgs = args;
  } else {
    apiInfoArgs = args.apiInfo.map(info => [info.group, info.version, args.pluralName]);
  }

  // Used for tests
  if (import.meta.env.UNDER_TEST === 'true') {
    const knownClass = (ResourceClasses as Record<string, KubeObjectClass>)[apiInfoArgs[0][2]];
    if (!!knownClass) {
      return knownClass;
    }
  }

  const crClassArgs = args as CRClassArgs;
  const objArgs = {
    isNamespaced: !!isNamespaced || crClassArgs.isNamespaced,
    singleName: crClassArgs.singularName || 'crd',
  };

  const apiFunc = !!objArgs.isNamespaced ? apiFactoryWithNamespace : apiFactory;
  return class CRClass extends KubeObject<any> {
    static objectName = objArgs.singleName;
    static apiEndpoint = apiFunc(...apiInfoArgs);
  };
}

export default CustomResourceDefinition;

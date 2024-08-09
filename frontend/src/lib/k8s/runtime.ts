import { apiFactory } from './apiProxy';
import { BaseKubeObject, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeRuntimeClass extends KubeObjectInterface {
  handler: string;
}

export class RuntimeClass
  extends makeKubeObject<KubeRuntimeClass>('RuntimeClass')
  implements BaseKubeObject
{
  static apiEndpoint = apiFactory('node.k8s.io', 'v1', 'runtimeclasses');
  static kind = 'RuntimeClass';

  static getBaseObject(): KubeRuntimeClass {
    const baseObject = BaseKubeObject.getBaseObject() as KubeRuntimeClass;
    baseObject.kind = RuntimeClass.kind;
    baseObject.metadata.name = 'base-runtimeclass';
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

import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeIngressClass extends KubeObjectInterface {
  spec: {
    controller: string;
    [key: string]: any;
  };
}

class IngressClass extends KubeObject<KubeIngressClass> {
  static kind = 'IngressClass';
  static apiName = 'ingressclasses';
  static apiVersion = 'networking.k8s.io/v1';
  static isNamespaced = false;

  static getBaseObject(): KubeIngressClass {
    const baseObject = super.getBaseObject() as KubeIngressClass;
    baseObject.spec = { controller: '' };
    return baseObject;
  }

  get spec(): KubeIngressClass['spec'] {
    return this.jsonData.spec;
  }

  get isDefault(): boolean {
    const annotations = this.jsonData.metadata?.annotations;
    if (annotations !== undefined) {
      return annotations['ingressclass.kubernetes.io/is-default-class'] === 'true';
    }
    return false;
  }

  static get listRoute() {
    return 'ingressclasses';
  }

  static get pluralName() {
    return 'ingressclasses';
  }
}

export default IngressClass;

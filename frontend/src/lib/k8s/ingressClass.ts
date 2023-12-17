import { apiFactory } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeIngressClass extends KubeObjectInterface {
  spec: {
    controller: string;
    [key: string]: any;
  };
}

class IngressClass extends makeKubeObject<KubeIngressClass>('ingressClass') {
  static apiEndpoint = apiFactory(['networking.k8s.io', 'v1', 'ingressclasses']);

  get spec(): KubeIngressClass['spec'] {
    return this.jsonData!.spec;
  }

  get isDefault(): boolean {
    const annotations = this.jsonData!.metadata?.annotations;
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

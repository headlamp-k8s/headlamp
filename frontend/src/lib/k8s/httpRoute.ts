import { GatewayParentReference } from './gateway';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface HTTPRouteRule {
  backendRefs: any[] | null;
  matches: any[] | null;
  [key: string]: any;
}

export interface KubeHTTPRoute extends KubeObjectInterface {
  spec: {
    hostnames: string[];
    parentRefs: GatewayParentReference[];
    rules: HTTPRouteRule[];
    [key: string]: any;
  };
}

class HTTPRoute extends KubeObject<KubeHTTPRoute> {
  static kind = 'HTTPRoute';
  static apiName = 'httproutes';
  static apiVersion = 'gateway.networking.k8s.io/v1beta1';
  static isNamespaced = true;

  get spec(): KubeHTTPRoute['spec'] {
    return this.jsonData.spec;
  }

  get hostnames(): string[] {
    return this.jsonData.spec.hostnames;
  }

  get rules(): HTTPRouteRule[] {
    return this.jsonData.spec.rules;
  }

  get parentRefs(): GatewayParentReference[] {
    return this.jsonData.spec.parentRefs;
  }

  static get pluralName() {
    return 'httproutes';
  }
}

export default HTTPRoute;

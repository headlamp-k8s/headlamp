import { GatewayParentReference } from './gateway';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeGRPCRoute extends KubeObjectInterface {
  spec: {
    parentRefs: GatewayParentReference[];
    [key: string]: any;
  };
}

class GRPCRoute extends KubeObject<KubeGRPCRoute> {
  static kind = 'GRPCRoute';
  static apiName = 'grpcroutes';
  static apiVersion = 'gateway.networking.k8s.io/v1beta1';
  static isNamespaced = true;

  get spec(): KubeGRPCRoute['spec'] {
    return this.jsonData.spec;
  }
  get parentRefs(): GatewayParentReference[] {
    return this.jsonData.spec.parentRefs;
  }

  static get pluralName() {
    return 'grpcroutes';
  }
}

export default GRPCRoute;

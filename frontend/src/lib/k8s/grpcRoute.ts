import { GatewayParentReference } from './gateway';
import { KubeObject, KubeObjectInterface } from './KubeObject';

/**
 * GRPCRoute is a Gateway API type for specifying routing behavior of gRPC requests from a Gateway listener to an API object, i.e. Service.
 *
 * @see {@link https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GRPCRoute} Gateway API reference for GRPCRoute
 *
 * @see {@link https://gateway-api.sigs.k8s.io/api-types/grpcroute/} Gateway API definition for GRPCRoute
 */
export interface KubeGRPCRoute extends KubeObjectInterface {
  spec: {
    parentRefs: GatewayParentReference[];
    [key: string]: any;
  };
}

class GRPCRoute extends KubeObject<KubeGRPCRoute> {
  static kind = 'GRPCRoute';
  static apiName = 'grpcroutes';
  static apiVersion = ['gateway.networking.k8s.io/v1', 'gateway.networking.k8s.io/v1beta1'];
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

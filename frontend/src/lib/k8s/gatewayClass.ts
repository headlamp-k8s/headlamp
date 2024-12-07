import { KubeCondition } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';

/**
 * GatewayClass is cluster-scoped resource defined by the infrastructure provider. This resource represents a class of Gateways that can be instantiated.
 *
 * @see {@link https://gateway-api.sigs.k8s.io/reference/spec/#gateway.networking.k8s.io/v1.GatewayClass} Gateway API reference for GatewayClass
 *
 * @see {@link https://gateway-api.sigs.k8s.io/api-types/gatewayclass/} Gateway API definition for GatewayClass
 */
export interface KubeGatewayClass extends KubeObjectInterface {
  spec: {
    controllerName: string;
    [key: string]: any;
  };
  status: {
    conditions?: KubeCondition[];
    [otherProps: string]: any;
  };
}

class GatewayClass extends KubeObject<KubeGatewayClass> {
  static kind = 'GatewayClass';
  static apiName = 'gatewayclasses';
  static apiVersion = ['gateway.networking.k8s.io/v1', 'gateway.networking.k8s.io/v1beta1'];
  static isNamespaced = false;

  get spec(): KubeGatewayClass['spec'] {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }

  get controllerName() {
    return this.spec!.controllerName;
  }

  static get listRoute() {
    return 'GatewayClasses';
  }

  static get pluralName() {
    return 'gatewayclasses';
  }
}

export default GatewayClass;

import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeGatewayClass extends KubeObjectInterface {
  spec: {
    controllerName: string;
    [key: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class GatewayClass extends KubeObject<KubeGatewayClass> {
  static kind = 'GatewayClass';
  static apiName = 'gatewayclasses';
  static apiVersion = 'gateway.networking.k8s.io/v1beta1';
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

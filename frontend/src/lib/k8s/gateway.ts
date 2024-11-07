import { KubeCondition } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface GatewayParentReference {
  group: string;
  kind: string;
  namespace: string;
  sectionName: string | null;
  name: string;
  [key: string]: any;
}

export interface GatewayListener {
  hostname: string;
  name: string;
  protocol: string;
  port: number;
  [key: string]: any;
}
export interface GatewayListenerStatus {
  name: string;
  conditions: KubeCondition[];
  [key: string]: any;
}
export interface GatewayAddress {
  type: string;
  value: string;
}

export interface KubeGateway extends KubeObjectInterface {
  spec: {
    gatewayClassName?: string;
    listeners: GatewayListener[];
    [key: string]: any;
  };
  status: {
    addresses: GatewayAddress[];
    listeners: GatewayListenerStatus[];
    [otherProps: string]: any;
  };
}

class Gateway extends KubeObject<KubeGateway> {
  static kind = 'Gateway';
  static apiName = 'gateways';
  static apiVersion = 'gateway.networking.k8s.io/v1beta1';
  static isNamespaced = true;

  get spec(): KubeGateway['spec'] {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }

  getListeners(): GatewayListener[] {
    return this.jsonData.spec.listeners;
  }

  getAddresses(): GatewayAddress[] {
    return this.jsonData.status.addresses;
  }

  getListernerStatusByName(name: string): GatewayListenerStatus | null {
    return this.jsonData.status.listeners.find(t => t.name === name) || null;
  }

  static get pluralName() {
    return 'gateways';
  }
  get listRoute(): string {
    return 'k8sgateways'; // fix magic name gateway
  }
  get detailsRoute(): string {
    return 'k8sgateway'; // fix magic name gateway
  }
}

export default Gateway;

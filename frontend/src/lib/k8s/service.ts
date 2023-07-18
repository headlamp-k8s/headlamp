import _ from 'lodash';
import { apiFactoryWithNamespace } from './apiProxy';
import { KubeCondition, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubePortStatus {
  error?: string;
  port: number;
  protocol: string;
}

export interface KubeLoadBalancerIngress {
  hostname?: string;
  ip?: string;
  ports?: KubePortStatus[];
}

export interface KubeService extends KubeObjectInterface {
  spec: {
    clusterIP: string;
    ports: {
      name: string;
      nodePort: number;
      port: number;
      protocol: string;
      targetPort: number | string;
    }[];
    type: string;
    externalIPs: string[];
    selector: {
      [key: string]: string;
    };
    [otherProps: string]: any;
  };
  status: {
    conditions?: KubeCondition[];
    loadBalancer?: {
      ingress: KubeLoadBalancerIngress[];
    };
  };
}

class Service extends makeKubeObject<KubeService>('service') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'services');

  get spec(): KubeService['spec'] {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }

  getExternalAddresses() {
    return _.uniq(
      (
        this.status?.loadBalancer?.ingress?.map(
          (ingress: KubeLoadBalancerIngress) => ingress.hostname || ingress.ip
        ) || []
      ).concat(this.spec.externalIPs || [])
    ).join(', ');
  }

  getPorts() {
    return this.spec?.ports?.map(port => port.port);
  }

  getSelector() {
    return Object.entries(this.spec?.selector || {}).map(([key, value]) => `${key}=${value}`);
  }
}

export default Service;

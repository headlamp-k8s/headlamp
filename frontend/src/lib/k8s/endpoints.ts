import { apiFactoryWithNamespace } from './apiProxy';
import { KubeMetadata, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeEndpointPort {
  name?: string;
  appProtocol: string;
  port: number;
  protocol: string;
}

export interface KubeEndpointAddress {
  hostname: string;
  ip: string;
  nodeName?: string;
  targetRef?: Pick<KubeObjectInterface, 'apiVersion' | 'kind'> &
    Pick<KubeMetadata, 'name' | 'namespace' | 'resourceVersion' | 'uid'> & {
      fieldPath: string;
    };
}

export interface KubeEndpointSubset {
  addresses?: KubeEndpointAddress[];
  notReadyAddresses?: KubeEndpointAddress[];
  ports?: KubeEndpointPort[];
}

export interface KubeEndpoint extends KubeObjectInterface {
  subsets: KubeEndpointSubset[];
}

class Endpoints extends makeKubeObject<KubeEndpoint>('endpoint') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'endpoints');

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }

  get subsets() {
    return this.jsonData!.subsets;
  }

  getAddressesText() {
    return this.getAddresses().join(', ');
  }

  getAddresses() {
    const addresses: string[] = [];
    this.subsets?.forEach((subset: KubeEndpointSubset) => {
      subset.ports?.forEach(port => {
        subset.addresses?.forEach(address => {
          addresses.push(address.ip + ':' + port.port);
        });
      });
    });
    return addresses;
  }
}

export default Endpoints;

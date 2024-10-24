import { KubeMetadata } from './KubeMetadata';
import { KubeObject, KubeObjectInterface } from './KubeObject';

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

class Endpoints extends KubeObject<KubeEndpoint> {
  static kind = 'Endpoints';
  static apiName = 'endpoints';
  static apiVersion = 'v1';
  static isNamespaced = true;

  // @todo Remove this when we can break backward compatibility.
  static get detailsRoute() {
    return 'Endpoint';
  }

  // @todo Remove this when we can break backward compatibility.
  static get className() {
    return 'Endpoint';
  }

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }

  get subsets() {
    return this.jsonData.subsets;
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

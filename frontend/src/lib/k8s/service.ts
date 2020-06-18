import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

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
    [otherProps: string]: any;
  };
}

class Service extends makeKubeObject<KubeService>('service') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'services');

  get spec() {
    return this.jsonData!.spec;
  }
}

export default Service;

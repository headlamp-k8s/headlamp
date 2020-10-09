import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeIngress extends KubeObjectInterface {
  spec: {
    rules: {
      host: string;
      http: {
        paths: {
          path: string;
          backend: {
            serviceName: string;
            servicePort: string;
          };
        }[];
      };
    }[];
  };
}

class Ingress extends makeKubeObject<KubeIngress>('ingress') {
  static apiEndpoint = apiFactoryWithNamespace('extensions', 'v1beta1', 'ingresses');

  get spec(): KubeIngress['spec'] {
    return this.jsonData!.spec;
  }

  getHosts() {
    return this.spec!.rules.map(({host}) => host).join(' | ');
  }

  get listRoute() {
    return 'ingresses';
  }
}

export default Ingress;

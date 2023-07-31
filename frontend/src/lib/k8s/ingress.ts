import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

interface LegacyIngressRule {
  host: string;
  http: {
    paths: {
      path: string;
      backend: LegacyIngressBackend;
    }[];
  };
}

export interface IngressRule {
  host: string;
  http: {
    paths: {
      path: string;
      pathType?: string;
      backend: IngressBackend;
    }[];
  };
}

interface LegacyIngressBackend {
  serviceName: string;
  servicePort: string;
}

export interface IngressBackend {
  service?: {
    name: string;
    port: {
      number?: number;
      name?: string;
    };
  };
  resource?: {
    apiVersion: string;
    kind: string;
    name: string;
  };
}

export interface KubeIngress extends KubeObjectInterface {
  spec: {
    ingressClassName?: string;
    rules: IngressRule[] | LegacyIngressRule[];
    tls?: {
      hosts: string[];
      secretName: string;
    }[];
    defaultBackend?: {
      resource?: {
        apiVersion: string;
        kind: string;
        name: string;
      };
      service?: {
        name: string;
        port: {
          name?: string;
          number?: number;
        };
      };
    };
    [key: string]: any;
  };
}

class Ingress extends makeKubeObject<KubeIngress>('ingress') {
  static apiEndpoint = apiFactoryWithNamespace(
    ['networking.k8s.io', 'v1', 'ingresses'],
    ['extensions', 'v1beta1', 'ingresses']
  );
  // Normalized, cached rules.
  private cachedRules: IngressRule[] = [];

  get spec(): KubeIngress['spec'] {
    return this.jsonData!.spec;
  }

  getHosts() {
    return this.spec!.rules.map(({ host }) => host).join(' | ');
  }

  getRules(): IngressRule[] {
    if (this.cachedRules.length > 0) {
      return this.cachedRules;
    }

    const rules: IngressRule[] = [];

    this.spec!.rules?.forEach(({ http, host }) => {
      const paths = http.paths.map(({ backend, path }) => {
        if (!!(backend as LegacyIngressBackend).serviceName) {
          return {
            path,
            backend: {
              service: {
                name: (backend as LegacyIngressBackend).serviceName,
                port: {
                  number: parseInt((backend as LegacyIngressBackend).servicePort, 10),
                },
              },
            },
          };
        } else {
          return {
            path,
            backend: backend as IngressBackend,
          };
        }
      });

      rules.push({
        host,
        http: { paths },
      });
    });

    this.cachedRules = rules;
    return rules;
  }

  static get listRoute() {
    return 'ingresses';
  }

  static get pluralName() {
    return 'ingresses';
  }
}

export default Ingress;

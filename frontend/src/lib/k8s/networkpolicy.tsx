import { LabelSelector } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface NetworkPolicyPort {
  port?: string | number;
  protocol?: string;
  endPort?: number;
}

export interface IPBlock {
  cidr: string;
  except: string[];
}

export interface NetworkPolicyPeer {
  ipBlock?: IPBlock;
  namespaceSelector?: LabelSelector;
  podSelector?: LabelSelector;
}

export interface NetworkPolicyEgressRule {
  ports: NetworkPolicyPort[];
  to: NetworkPolicyPeer[];
}

export interface NetworkPolicyIngressRule {
  ports: NetworkPolicyPort[];
  from: NetworkPolicyPeer[];
}

export interface KubeNetworkPolicy extends KubeObjectInterface {
  egress: NetworkPolicyEgressRule[];
  ingress: NetworkPolicyIngressRule[];
  podSelector: LabelSelector;
  policyTypes: string[];
}

class NetworkPolicy extends KubeObject<KubeNetworkPolicy> {
  static kind = 'NetworkPolicy';
  static apiName = 'networkpolicies';
  static apiVersion = 'networking.k8s.io/v1';
  static isNamespaced = true;

  static getBaseObject(): KubeNetworkPolicy {
    const baseObject = super.getBaseObject() as KubeNetworkPolicy;
    baseObject.egress = [
      {
        ports: [
          {
            port: 80,
            protocol: 'TCP',
          },
        ],
        to: [
          {
            podSelector: {
              matchLabels: { app: 'headlamp' },
            },
          },
        ],
      },
    ];
    baseObject.ingress = [
      {
        ports: [
          {
            port: 80,
            protocol: 'TCP',
          },
        ],
        from: [
          {
            podSelector: {
              matchLabels: { app: 'headlamp' },
            },
          },
        ],
      },
    ];
    baseObject.podSelector = {
      matchLabels: { app: 'headlamp' },
    };
    baseObject.policyTypes = ['Ingress', 'Egress'];
    return baseObject;
  }

  static get pluralName() {
    return 'networkpolicies';
  }
}

export default NetworkPolicy;

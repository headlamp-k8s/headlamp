import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster';

interface NetworkPolicyPort {
  port?: string | number;
  protocol?: string;
  endPort?: number;
}

interface IPBlock {
  cidr: string;
  except: string;
}

interface NetworkPolicyPeer {
  ipBlock?: IPBlock;
  namespaceSelector?: LabelSelector;
  podSelector?: LabelSelector;
}

interface NetworkPolicyEgressRule {
  ports: NetworkPolicyPort[];
  to: NetworkPolicyPeer[];
}

interface NetworkPolicyIngressRule {
  ports: NetworkPolicyPort[];
  from: NetworkPolicyPeer[];
}

export interface KubeNetworkPolicy extends KubeObjectInterface {
  egress: NetworkPolicyEgressRule[];
  ingress: NetworkPolicyIngressRule[];
  podSelector: LabelSelector;
  policyTypes: string[];
}

class NetworkPolicy extends makeKubeObject<KubeNetworkPolicy>('NetworkPolicy') {
  static apiEndpoint = apiFactoryWithNamespace('networking.k8s.io', 'v1', 'networkpolicies');
}

export default NetworkPolicy;

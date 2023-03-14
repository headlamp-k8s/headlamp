import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface LeaseSpec {
  holderIdentity: string;
  leaseDurationSeconds: number;
  leaseTransitions: number;
  renewTime: string;
}

export interface KubeObject extends KubeObjectInterface {
  spec: LeaseSpec;
}

export class Lease extends makeKubeObject<KubeObject>('lease') {
  static apiEndpoint = apiFactoryWithNamespace('coordination.k8s.io', 'v1', 'leases');

  get spec() {
    return this.jsonData!.spec;
  }
}

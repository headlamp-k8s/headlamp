import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface LeaseSpec {
  holderIdentity: string;
  leaseDurationSeconds: number;
  leaseTransitions: number;
  renewTime: string;
}

export interface KubeLease extends KubeObjectInterface {
  spec: LeaseSpec;
}

export class Lease extends makeKubeObject<KubeLease>('Lease') {
  static apiEndpoint = apiFactoryWithNamespace('coordination.k8s.io', 'v1', 'leases');

  static getBaseObject(): KubeLease {
    const baseObject = super.getBaseObject() as KubeLease;
    baseObject.spec = {
      holderIdentity: '',
      leaseDurationSeconds: 0,
      leaseTransitions: 0,
      renewTime: '',
    };
    return baseObject;
  }

  get spec() {
    return this.jsonData!.spec;
  }
}

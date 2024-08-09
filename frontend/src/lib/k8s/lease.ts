import { apiFactoryWithNamespace } from './apiProxy';
import { BaseKubeObject, KubeObjectInterface, makeKubeObject } from './cluster';

export interface LeaseSpec {
  holderIdentity: string;
  leaseDurationSeconds: number;
  leaseTransitions: number;
  renewTime: string;
}

export interface KubeLease extends KubeObjectInterface {
  spec: LeaseSpec;
}

export class Lease extends makeKubeObject<KubeLease>('Lease') implements BaseKubeObject {
  static apiEndpoint = apiFactoryWithNamespace('coordination.k8s.io', 'v1', 'leases');
  static kind = 'Lease';

  static getBaseObject(): KubeLease {
    const baseObject = BaseKubeObject.getBaseObject() as KubeLease;
    baseObject.kind = Lease.kind;
    baseObject.metadata.name = 'base-lease';
    baseObject.spec = {
      holderIdentity: 'holder',
      leaseDurationSeconds: 10,
      leaseTransitions: 1,
      renewTime: '',
    };
    return baseObject;
  }

  get spec() {
    return this.jsonData!.spec;
  }
}

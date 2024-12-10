import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface LeaseSpec {
  holderIdentity: string;
  leaseDurationSeconds: number;
  leaseTransitions: number;
  renewTime: string;
}

export interface KubeLease extends KubeObjectInterface {
  spec: LeaseSpec;
}

export class Lease extends KubeObject<KubeLease> {
  static kind = 'Lease';
  static apiName = 'leases';
  static apiVersion = 'coordination.k8s.io/v1';
  static isNamespaced = true;

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
    return this.jsonData.spec;
  }
}

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

export class Lease extends makeKubeObject<KubeLease>() {
  static kind = 'Lease';
  static apiName = 'leases';
  static apiVersion = 'coordination.k8s.io/v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('coordination.k8s.io', 'v1', 'leases');

  get spec() {
    return this.jsonData!.spec;
  }
}

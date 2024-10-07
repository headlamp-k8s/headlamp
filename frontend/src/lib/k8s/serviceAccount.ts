import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeServiceAccount extends KubeObjectInterface {
  secrets: {
    apiVersion: string;
    fieldPath: string;
    kind: string;
    name: string;
    namespace: string;
    uid: string;
  }[];
}

class ServiceAccount extends makeKubeObject<KubeServiceAccount>() {
  static kind = 'ServiceAccount';
  static apiName = 'serviceaccounts';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'serviceaccounts');

  get secrets(): KubeServiceAccount['secrets'] {
    return this.jsonData!.secrets;
  }
}

export default ServiceAccount;

import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './cluster';

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

class ServiceAccount extends KubeObject<KubeServiceAccount> {
  static objectName = 'serviceAccount';
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'serviceaccounts');

  get secrets(): KubeServiceAccount['secrets'] {
    return this.jsonData.secrets;
  }
}

export default ServiceAccount;

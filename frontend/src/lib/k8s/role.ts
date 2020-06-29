import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeRole extends KubeObjectInterface {
  rules: {
    apiGroups: string[];
    nonResourceURLs: string[];
    resourceNames: string[];
    resources: string[];
    verbs: string[];
  };
}

class Role extends makeKubeObject<KubeRole>('role') {
  static apiEndpoint = apiFactoryWithNamespace('rbac.authorization.k8s.io', 'v1', 'roles');

  get rules() {
    return this.jsonData!.rules;
  }
}

export default Role;

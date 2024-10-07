import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeRoleBinding extends KubeObjectInterface {
  roleRef: {
    apiGroup: string;
    kind: string;
    name: string;
  };
  subjects: {
    apiGroup: string;
    kind: string;
    name: string;
    namespace: string;
  }[];
}

class RoleBinding extends makeKubeObject<KubeRoleBinding>() {
  static kind = 'RoleBinding';
  static apiName = 'rolebindings';
  static apiVersion = 'rbac.authorization.k8s.io/v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('rbac.authorization.k8s.io', 'v1', 'rolebindings');

  get roleRef() {
    return this.jsonData!.roleRef;
  }

  get subjects(): KubeRoleBinding['subjects'] {
    return this.jsonData!.subjects;
  }
}

export default RoleBinding;

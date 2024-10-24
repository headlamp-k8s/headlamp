import { KubeObject, KubeObjectInterface } from './KubeObject';

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

class RoleBinding extends KubeObject<KubeRoleBinding> {
  static kind = 'RoleBinding';
  static apiName = 'rolebindings';
  static apiVersion = 'rbac.authorization.k8s.io/v1';
  static isNamespaced = true;

  get roleRef() {
    return this.jsonData.roleRef;
  }

  get subjects(): KubeRoleBinding['subjects'] {
    return this.jsonData.subjects;
  }
}

export default RoleBinding;

import { apiFactory } from './apiProxy';
import RoleBinding from './roleBinding';

class ClusterRoleBinding extends RoleBinding {
  static apiEndpoint = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterrolebindings');

  static get className(): string {
    return 'ClusterRoleBinding';
  }

  get detailsRoute() {
    return 'clusterRoleBinding';
  }
}

export default ClusterRoleBinding;

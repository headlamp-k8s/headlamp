import { apiFactory } from './apiProxy';
import RoleBinding from './roleBinding';

class ClusterRoleBinding extends RoleBinding {
  static apiEndpoint = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterrolebindings');

  get detailsRoute() {
    return 'clusterRoleBinding';
  }
}

export default ClusterRoleBinding;

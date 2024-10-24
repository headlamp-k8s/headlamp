import { apiFactory } from './apiProxy';
import { makeKubeObject } from './KubeObject';
import { KubeRole } from './role';

class ClusterRole extends makeKubeObject<KubeRole>('role') {
  static apiEndpoint = apiFactory('rbac.authorization.k8s.io', 'v1', 'clusterroles');

  static get className() {
    return 'ClusterRole';
  }

  get detailsRoute() {
    return 'clusterRole';
  }

  get rules() {
    return this.jsonData!.rules;
  }
}

export default ClusterRole;

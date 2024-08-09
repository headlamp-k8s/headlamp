import { ApiClient } from './api/v1/apiTypes';
import { apiFactory } from './apiProxy';
import { makeKubeObject } from './cluster';
import { KubeRole } from './role';

class ClusterRole extends makeKubeObject<KubeRole>('role') {
  static apiEndpoint: ApiClient<KubeRole> = apiFactory(
    'rbac.authorization.k8s.io',
    'v1',
    'clusterroles'
  );

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

import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeResourceQuota extends KubeObjectInterface {}

class ResourceQuota extends makeKubeObject<KubeResourceQuota>('resourceQuota') {
  static apiEndpoint = apiFactoryWithNamespace(['', 'v1', 'resourcequotas']);
}

export default ResourceQuota;

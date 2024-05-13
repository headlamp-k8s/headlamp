import { apiFactory } from './apiProxy';
import { KubeCondition, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeNamespace extends KubeObjectInterface {
  status: {
    phase: string;
    conditions?: KubeCondition[];
  };
}

class Namespace extends makeKubeObject<KubeNamespace>('namespace') {
  static apiEndpoint = apiFactory('', 'v1', 'namespaces');

  get status() {
    return this.jsonData.status;
  }
}

export default Namespace;

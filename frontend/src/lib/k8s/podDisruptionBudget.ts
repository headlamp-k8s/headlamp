import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubePodDisruptionBudget extends KubeObjectInterface {
  data: StringDict;
}

class PodDisruptionBudget extends makeKubeObject<KubePodDisruptionBudget>('podDisruptionBudget') {
  static apiEndpoint = apiFactoryWithNamespace(['policy', 'v1', 'poddisruptionbudgets']);
}

export default PodDisruptionBudget;

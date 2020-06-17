import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends makeKubeObject<KubeConfigMap>('configMap') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');

  get data() {
    return this.jsonData?.data;
  }
}

export default ConfigMap;

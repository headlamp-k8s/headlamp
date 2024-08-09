import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface, StringDict } from './cluster';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends KubeObject<KubeConfigMap> {
  static objectName = 'configMap';
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');

  get data() {
    return this.jsonData.data;
  }
}

export default ConfigMap;

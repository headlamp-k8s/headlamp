import { apiFactoryWithNamespace } from './apiProxy';
import { StringDict } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends KubeObject<KubeConfigMap> {
  static kind = 'ConfigMap';
  static apiName = 'configmaps';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');

  get data() {
    return this.jsonData.data;
  }
}

export default ConfigMap;

import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends makeKubeObject<KubeConfigMap>() {
  static kind = 'ConfigMap';
  static apiName = 'configmaps';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');

  get data() {
    return this.jsonData?.data;
  }
}

export default ConfigMap;

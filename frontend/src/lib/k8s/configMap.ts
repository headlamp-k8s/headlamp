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

  get data() {
    return this.jsonData.data;
  }
}

export default ConfigMap;

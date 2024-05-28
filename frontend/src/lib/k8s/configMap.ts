import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends makeKubeObject<KubeConfigMap>('ConfigMap') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');

  get data() {
    return this.jsonData?.data;
  }

  static getBaseObject(): KubeConfigMap {
    const baseObject = super.getBaseObject() as KubeConfigMap;
    baseObject.data = {};
    return baseObject;
  }
}

export default ConfigMap;

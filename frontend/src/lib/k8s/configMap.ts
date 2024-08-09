import { apiFactoryWithNamespace } from './apiProxy';
import { BaseKubeObject, KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeConfigMap extends KubeObjectInterface {
  data: StringDict;
}

class ConfigMap extends makeKubeObject<KubeConfigMap>('configMap') implements BaseKubeObject {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'configmaps');
  static kind = 'ConfigMap';

  static getBaseObject(): KubeConfigMap {
    const baseObject = BaseKubeObject.getBaseObject() as KubeConfigMap;
    baseObject.kind = ConfigMap.kind;
    baseObject.metadata.name = 'base-configmap';
    baseObject.data = {};
    return baseObject;
  }

  get data() {
    return this.jsonData?.data;
  }
}

export default ConfigMap;

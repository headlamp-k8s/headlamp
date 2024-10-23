import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeSecret extends KubeObjectInterface {
  data: StringDict;
  type: string;
}

class Secret extends makeKubeObject<KubeSecret>('Secret') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'secrets');

  static getBaseObject(): KubeSecret {
    const baseObject = super.getBaseObject() as KubeSecret;
    baseObject.data = {};
    return baseObject;
  }

  get data() {
    return this.jsonData!.data;
  }

  get type() {
    return this.jsonData!.type;
  }
}

export default Secret;

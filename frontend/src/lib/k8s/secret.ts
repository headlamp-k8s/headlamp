import { apiFactoryWithNamespace } from './apiProxy';
import { BaseKubeObject, KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeSecret extends KubeObjectInterface {
  data: StringDict;
  type: string;
}

class Secret extends makeKubeObject<KubeSecret>('secret') implements BaseKubeObject {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'secrets');
  static kind = 'Secret';

  static getBaseObject(): KubeSecret {
    const baseObject = BaseKubeObject.getBaseObject() as KubeSecret;
    baseObject.kind = Secret.kind;
    baseObject.metadata.name = 'base-secret';
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

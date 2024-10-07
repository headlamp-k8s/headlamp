import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject, StringDict } from './cluster';

export interface KubeSecret extends KubeObjectInterface {
  data: StringDict;
  type: string;
}

class Secret extends makeKubeObject<KubeSecret>() {
  static kind = 'Secret';
  static apiName = 'secrets';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static objectName = 'Secret';
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'secrets');

  get data() {
    return this.jsonData!.data;
  }

  get type() {
    return this.jsonData!.type;
  }
}

export default Secret;

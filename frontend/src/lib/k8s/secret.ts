import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface KubeSecret extends KubeObjectInterface {
  data: Record<string, string>;
  type: string;
}

class Secret extends KubeObject<KubeSecret> {
  static kind = 'Secret';
  static apiName = 'secrets';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'secrets');

  get data() {
    return this.jsonData.data;
  }

  get type() {
    return this.jsonData.type;
  }
}

export default Secret;

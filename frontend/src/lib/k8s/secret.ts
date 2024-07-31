import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface, StringDict } from './cluster';

export interface KubeSecret extends KubeObjectInterface {
  data: StringDict;
  type: string;
}

class Secret extends KubeObject<KubeSecret> {
  static objectName = 'Secret';
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'secrets');

  get data() {
    return this.jsonData.data;
  }

  get type() {
    return this.jsonData.type;
  }
}

export default Secret;

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

  static getBaseObject(): KubeSecret {
    const baseObject = super.getBaseObject() as KubeSecret;
    baseObject.data = {};
    return baseObject;
  }

  get data() {
    return this.jsonData.data;
  }

  get type() {
    return this.jsonData.type;
  }
}

export default Secret;

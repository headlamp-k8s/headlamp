import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObject, KubeObjectInterface } from './KubeObject';

export interface LimitRangeSpec {
  limits: {
    default: {
      cpu: string;
      memory: string;
    };
    defaultRequest: {
      cpu: string;
      memory: string;
    };
    max: {
      cpu: string;
      memory: string;
    };
    min: {
      cpu: string;
      memory: string;
    };
    type: string;
  }[];
}

export interface KubeLimitRange extends KubeObjectInterface {
  spec: LimitRangeSpec;
}

export class LimitRange extends KubeObject<KubeLimitRange> {
  static kind = 'LimitRange';
  static apiName = 'limitranges';
  static apiVersion = 'v1';
  static isNamespaced = true;

  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'limitranges');

  get spec() {
    return this.jsonData.spec;
  }
}

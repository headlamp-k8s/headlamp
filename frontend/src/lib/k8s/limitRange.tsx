import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

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

export class LimitRange extends makeKubeObject<KubeLimitRange>('LimitRange') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'limitranges');

  get spec() {
    return this.jsonData!.spec;
  }
}

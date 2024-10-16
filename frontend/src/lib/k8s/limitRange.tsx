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

  static getBaseObject(): KubeLimitRange {
    const baseObject = super.getBaseObject() as KubeLimitRange;
    baseObject.spec = {
      limits: [
        {
          default: {
            cpu: '',
            memory: '',
          },
          defaultRequest: {
            cpu: '',
            memory: '',
          },
          max: {
            cpu: '',
            memory: '',
          },
          min: {
            cpu: '',
            memory: '',
          },
          type: '',
        },
      ],
    };
    return baseObject;
  }

  get spec() {
    return this.jsonData!.spec;
  }
}

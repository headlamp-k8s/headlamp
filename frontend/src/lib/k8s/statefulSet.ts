import { KubeContainer, LabelSelector } from './cluster';
import { KubeMetadata } from './KubeMetadata';
import { KubeObject, KubeObjectInterface } from './KubeObject';
import { KubePodSpec } from './pod';

export interface KubeStatefulSet extends KubeObjectInterface {
  spec: {
    selector: LabelSelector;
    updateStrategy: {
      rollingUpdate: {
        partition: number;
      };
      type: string;
    };
    template: {
      metadata?: KubeMetadata;
      spec: KubePodSpec;
    };
    [other: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class StatefulSet extends KubeObject<KubeStatefulSet> {
  static kind = 'StatefulSet';
  static apiName = 'statefulsets';
  static apiVersion = 'apps/v1';
  static isNamespaced = true;

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }

  static getBaseObject(): KubeStatefulSet {
    const baseObject = super.getBaseObject() as KubeStatefulSet;
    baseObject.metadata = {
      ...baseObject.metadata,
      namespace: '',
    };
    baseObject.spec = {
      selector: {
        matchLabels: { app: 'headlamp' },
      },
      updateStrategy: {
        type: 'RollingUpdate',
        rollingUpdate: { partition: 0 },
      },
      template: {
        spec: {
          containers: [
            {
              name: '',
              image: '',
              imagePullPolicy: 'Always',
            },
          ],
          nodeName: '',
        },
      },
    };
    return baseObject;
  }

  getContainers(): KubeContainer[] {
    return this.spec?.template?.spec?.containers || [];
  }
}

export default StatefulSet;

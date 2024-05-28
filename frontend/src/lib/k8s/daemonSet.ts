import { KubeContainer, LabelSelector } from './cluster';
import { KubeMetadata } from './KubeMetadata';
import { KubeObject, KubeObjectInterface } from './KubeObject';
import { KubePodSpec } from './pod';

export interface KubeDaemonSet extends KubeObjectInterface {
  spec: {
    updateStrategy: {
      type: string;
      rollingUpdate: {
        maxUnavailable: number;
      };
    };
    selector: LabelSelector;
    template: {
      metadata?: KubeMetadata;
      spec: KubePodSpec;
    };
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class DaemonSet extends KubeObject<KubeDaemonSet> {
  static kind = 'DaemonSet';
  static apiName = 'daemonsets';
  static apiVersion = 'apps/v1';
  static isNamespaced = true;

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
  }

  static getBaseObject(): KubeDaemonSet {
    const baseObject = super.getBaseObject() as KubeDaemonSet;
    baseObject.metadata = {
      ...baseObject.metadata,
      namespace: '',
    };
    baseObject.spec = {
      updateStrategy: {
        type: 'RollingUpdate',
        rollingUpdate: {
          maxUnavailable: 1,
        },
      },
      selector: {
        matchLabels: { app: 'headlamp' },
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

  getNodeSelectors(): string[] {
    const selectors = this.spec?.template?.spec?.nodeSelector || {};
    return Object.keys(selectors).map(key => `${key}=${selectors[key]}`);
  }
}

export default DaemonSet;

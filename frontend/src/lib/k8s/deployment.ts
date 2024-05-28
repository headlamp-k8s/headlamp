import { KubeContainer, LabelSelector } from './cluster';
import { KubeMetadata } from './KubeMetadata';
import { KubeObject, KubeObjectInterface } from './KubeObject';
import { KubePodSpec } from './pod';

export interface KubeDeployment extends KubeObjectInterface {
  spec: {
    selector?: LabelSelector;
    strategy?: {
      type: string;
      [otherProps: string]: any;
    };
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

class Deployment extends KubeObject<KubeDeployment> {
  static kind = 'Deployment';
  static apiName = 'deployments';
  static apiVersion = 'apps/v1';
  static isNamespaced = true;

  get spec() {
    return this.getValue('spec');
  }

  get status() {
    return this.getValue('status');
  }

  getContainers(): KubeContainer[] {
    return this.spec?.template?.spec?.containers || [];
  }

  getMatchLabelsList(): string[] {
    const labels = this.spec.selector.matchLabels || {};
    return Object.keys(labels).map(key => `${key}=${labels[key]}`);
  }

  static getBaseObject(): KubeDeployment {
    const baseObject = super.getBaseObject() as KubeDeployment;
    baseObject.metadata = {
      ...baseObject.metadata,
      namespace: '',
      labels: { app: 'headlamp' },
    };
    baseObject.spec = {
      selector: {
        matchLabels: { app: 'headlamp' },
      },
      template: {
        spec: {
          containers: [
            {
              name: '',
              image: '',
              ports: [{ containerPort: 80 }],
              imagePullPolicy: 'Always',
            },
          ],
          nodeName: '',
        },
      },
    };

    return baseObject;
  }
}

export default Deployment;

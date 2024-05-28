import { KubeCondition, KubeContainer, LabelSelector } from './cluster';
import { KubeMetadata } from './KubeMetadata';
import { KubeObject, KubeObjectInterface } from './KubeObject';
import { KubePodSpec } from './pod';

export interface KubeReplicaSet extends KubeObjectInterface {
  spec: {
    minReadySeconds: number;
    replicas: number;
    selector: LabelSelector;
    template: {
      metadata?: KubeMetadata;
      spec: KubePodSpec;
    };
    [other: string]: any;
  };
  status: {
    availableReplicas: number;
    conditions: Omit<KubeCondition, 'lastProbeTime' | 'lastUpdateTime'>[];
    fullyLabeledReplicas: number;
    observedGeneration: number;
    readyReplicas: number;
    replicas: number;
  };
}

class ReplicaSet extends KubeObject<KubeReplicaSet> {
  static kind = 'ReplicaSet';
  static apiName = 'replicasets';
  static apiVersion = 'apps/v1';
  static isNamespaced = true;

  get spec(): KubeReplicaSet['spec'] {
    return this.jsonData.spec;
  }

  get status(): KubeReplicaSet['status'] {
    return this.jsonData.status;
  }

  static getBaseObject(): KubeReplicaSet {
    const baseObject = super.getBaseObject() as KubeReplicaSet;
    baseObject.metadata = {
      ...baseObject.metadata,
      namespace: '',
    };
    baseObject.spec = {
      minReadySeconds: 0,
      replicas: 1,
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

  getMatchLabelsList(): string[] {
    const labels = this.spec.selector.matchLabels || {};
    return Object.keys(labels).map(key => `${key}=${labels[key]}`);
  }
}

export default ReplicaSet;

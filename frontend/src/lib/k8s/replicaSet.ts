import { apiFactoryWithNamespace } from './apiProxy';
import {
  KubeCondition,
  KubeContainer,
  KubeMetadata,
  KubeObjectInterface,
  LabelSelector,
  makeKubeObject,
} from './cluster';
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

class ReplicaSet extends makeKubeObject<KubeReplicaSet>('ReplicaSet') {
  static apiEndpoint = apiFactoryWithNamespace('apps', 'v1', 'replicasets', true);

  get spec(): KubeReplicaSet['spec'] {
    return this.jsonData!.spec;
  }

  get status(): KubeReplicaSet['status'] {
    return this.jsonData!.status;
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

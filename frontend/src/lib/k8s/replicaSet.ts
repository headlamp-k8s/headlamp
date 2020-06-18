import { apiFactoryWithNamespace } from './apiProxy';
import { KubeCondition, KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster';

export interface KubeReplicaSet extends KubeObjectInterface {
  spec: {
    minReadySeconds: number;
    replicas: number;
    selector: LabelSelector;
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

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }
}

export default ReplicaSet;

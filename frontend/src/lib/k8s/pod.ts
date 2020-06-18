import { apiFactoryWithNamespace } from './apiProxy';
import { KubeCondition, KubeContainer, KubeContainerStatus, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubePod extends KubeObjectInterface {
  spec: {
    containers: KubeContainer[];
  };
  status: {
    conditions: KubeCondition[];
    containerStatuses: KubeContainerStatus[];
    hostIP: string;
    message: string;
    phase: string;
    qosClass: string;
    reason: string;
    startTime: number;
    [other: string]: any;
  };
}

class Pod extends makeKubeObject<KubePod>('pod') {
  static apiEndpoint = apiFactoryWithNamespace('', 'v1', 'pods');

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }
}

export default Pod;

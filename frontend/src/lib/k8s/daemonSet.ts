import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster';

export interface KubeDaemonSet extends KubeObjectInterface {
  spec: {
    updateStrategy: {
      type: string;
      rollingUpdate: {
        maxUnavailable: number;
      };
    };
    selector: LabelSelector;
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class DaemonSet extends makeKubeObject<KubeDaemonSet>('DaemonSet') {
  static apiEndpoint = apiFactoryWithNamespace('apps', 'v1', 'daemonsets');

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }

  get listRoute() {
    return 'workloads';
  }
}

export default DaemonSet;

import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster';

export interface KubeJob extends KubeObjectInterface {
  spec: {
    selector: LabelSelector;
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class Job extends makeKubeObject<KubeJob>('Job') {
  static apiEndpoint = apiFactoryWithNamespace('batch', 'v1', 'jobs');

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

export default Job;

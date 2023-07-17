import { apiFactoryWithNamespace } from './apiProxy';
import {
  KubeContainer,
  KubeMetadata,
  KubeObjectInterface,
  LabelSelector,
  makeKubeObject,
} from './cluster';
import { KubePodSpec } from './pod';

export interface KubeJob extends KubeObjectInterface {
  spec: {
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

class Job extends makeKubeObject<KubeJob>('Job') {
  static apiEndpoint = apiFactoryWithNamespace('batch', 'v1', 'jobs');

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }

  getContainers(): KubeContainer[] {
    return this.spec?.template?.spec?.containers || [];
  }

  /** Returns the duration of the job in milliseconds. */
  getDuration(): number {
    const startTime = this.status?.startTime;
    const completionTime = this.status?.completionTime;
    if (startTime && completionTime) {
      const duration = new Date(completionTime).getTime() - new Date(startTime).getTime();
      return duration;
    }
    return -1;
  }
}

export default Job;

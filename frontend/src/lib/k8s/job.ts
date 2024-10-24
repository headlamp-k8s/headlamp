import { KubeContainer, LabelSelector } from './cluster';
import { KubeMetadata } from './KubeMetadata';
import { KubeObject, KubeObjectInterface } from './KubeObject';
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

class Job extends KubeObject<KubeJob> {
  static kind = 'Job';
  static apiName = 'jobs';
  static apiVersion = 'batch/v1';
  static isNamespaced = true;

  get spec() {
    return this.jsonData.spec;
  }

  get status() {
    return this.jsonData.status;
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

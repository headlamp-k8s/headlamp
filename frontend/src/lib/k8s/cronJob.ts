import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeCronJob extends KubeObjectInterface {
  spec: {
    suspend: boolean;
    schedule: string;
    startingDeadlineSeconds?: number;
    successfulJobsHistoryLimit: number;
    failedJobsHistoryLimit: number;
    concurrencyPolicy: string;
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class CronJob extends makeKubeObject<KubeCronJob>('CronJob') {
  static apiEndpoint = apiFactoryWithNamespace(
    ['batch', 'v1', 'cronjobs'],
    ['batch', 'v1beta1', 'cronjobs']
  );

  get spec() {
    return this.getValue('spec');
  }

  get status() {
    return this.getValue('status');
  }
}

export default CronJob;

import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeCronJob extends KubeObjectInterface {
  spec: {
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class CronJob extends makeKubeObject<KubeCronJob>('CronJob') {
  static apiEndpoint = apiFactoryWithNamespace('batch', 'v1beta1', 'cronjobs');

  get spec() {
    return this.getValue('spec');
  }

  get status() {
    return this.getValue('status');
  }

  get listRoute() {
    return 'workloads';
  }
}

export default CronJob;

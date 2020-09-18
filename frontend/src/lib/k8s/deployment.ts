import { apiFactoryWithNamespace } from './apiProxy';
import { KubeObjectInterface, LabelSelector, makeKubeObject } from './cluster';

export interface KubeDeployment extends KubeObjectInterface {
  spec: {
    selector?: LabelSelector;
    strategy?: {
      type: string;
      [otherProps: string]: any;
    };
    [otherProps: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class Deployment extends makeKubeObject<KubeDeployment>('Deployment') {
  static apiEndpoint = apiFactoryWithNamespace('apps', 'v1', 'deployments', true);

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

export default Deployment;

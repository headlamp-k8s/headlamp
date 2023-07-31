import { apiFactoryWithNamespace } from './apiProxy';
import {
  KubeContainer,
  KubeMetadata,
  KubeObjectInterface,
  LabelSelector,
  makeKubeObject,
} from './cluster';
import { KubePodSpec } from './pod';

export interface KubeDaemonSet extends KubeObjectInterface {
  spec: {
    updateStrategy: {
      type: string;
      rollingUpdate: {
        maxUnavailable: number;
      };
    };
    selector: LabelSelector;
    template: {
      metadata: KubeMetadata;
      spec: KubePodSpec;
    };
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

  getContainers(): KubeContainer[] {
    return this.spec?.template?.spec?.containers || [];
  }

  getNodeSelectors(): string[] {
    const selectors = this.spec?.template?.spec?.nodeSelector || {};
    return Object.keys(selectors).map(key => `${key}=${selectors[key]}`);
  }
}

export default DaemonSet;

import { apiFactoryWithNamespace } from './apiProxy';
import {
  KubeContainer,
  KubeMetadata,
  KubeObjectInterface,
  LabelSelector,
  makeKubeObject,
} from './cluster';
import { KubePodSpec } from './pod';

export interface KubeStatefulSet extends KubeObjectInterface {
  spec: {
    selector: LabelSelector;
    updateStrategy: {
      rollingUpdate: {
        partition: number;
      };
      type: string;
    };
    template: {
      metadata: KubeMetadata;
      spec: KubePodSpec;
    };
    [other: string]: any;
  };
  status: {
    [otherProps: string]: any;
  };
}

class StatefulSet extends makeKubeObject<KubeStatefulSet>('StatefulSet') {
  static apiEndpoint = apiFactoryWithNamespace('apps', 'v1', 'statefulsets', true);

  get spec() {
    return this.jsonData!.spec;
  }

  get status() {
    return this.jsonData!.status;
  }

  getContainers(): KubeContainer[] {
    return this.spec?.template?.spec?.containers || [];
  }
}

export default StatefulSet;

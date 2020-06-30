import { useConnectApi } from '.';
import { metrics } './api';
import { apiFactory } from './apiProxy';
import { KubeCondition, KubeMetrics, KubeObjectInterface, makeKubeObject } from './cluster';

export interface KubeNode extends KubeObjectInterface {
  status: {
    addresses: {
      address: string;
      type: string;
    }[];
    capacity: {
      cpu: any;
      memory: any;
    };
    conditions: (Omit<KubeCondition, 'lastProbeTime' | 'lastUpdateTime'> & {
      lastHeartbeatTime: string;
    })[];
    nodeInfo: {
      architecture: string;
      bootID: string;
      containerRuntimeVersion: string;
      kernelVersion: string;
      kubeProxyVersion: string;
      kubeletVersion: string;
      machineID: string;
      operatingSystem: string;
      osImage: string;
      systemUUID: string;
    };
  };
  spec: {
    podCIDR: string;
    [otherProps: string]: any;
  };
}

class Node extends makeKubeObject<KubeNode>('node') {
  static apiEndpoint = apiFactory('', 'v1', 'nodes');

  get status() {
    return this.jsonData!.status;
  }

  get spec() {
    return this.jsonData!.spec;
  }

  static useMetrics(onMetrics: (metricsList: KubeMetrics[]) => void) {
    useConnectApi(metrics.bind(null, '/apis/metrics.k8s.io/v1beta1/nodes', onMetrics));
  }
}

export default Node;

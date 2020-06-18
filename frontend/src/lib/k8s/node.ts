import { apiFactory } from './apiProxy';
import { KubeCondition, KubeObjectInterface, makeKubeObject } from './cluster';

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
}

export default Node;

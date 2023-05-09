import React from 'react';
import { useErrorState } from '../util';
import { useConnectApi } from '.';
import { ApiError, apiFactory, fetchMetricsForClusters, metrics } from './apiProxy';
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

  get status(): KubeNode['status'] {
    return this.jsonData!.status;
  }

  get spec(): KubeNode['spec'] {
    return this.jsonData!.spec;
  }

  static useMetrics(): [KubeMetrics[] | null, ApiError | null] {
    const [nodeMetrics, setNodeMetrics] = React.useState<KubeMetrics[] | null>(null);
    const [error, setError] = useErrorState(setNodeMetrics);

    function setMetrics(metrics: KubeMetrics[]) {
      setNodeMetrics(metrics);

      if (metrics !== null) {
        setError(null);
      }
    }

    useConnectApi(metrics.bind(null, '/apis/metrics.k8s.io/v1beta1/nodes', setMetrics, setError));

    return [nodeMetrics, error];
  }

  static useMetricsPerCluster(): [
    { [cluster: string]: KubeMetrics[] },
    { [cluster: string]: ApiError }
  ] {
    const [nodeMetrics, setNodeMetrics] = React.useState<{ [cluster: string]: KubeMetrics[] }>({});
    const [errors, setErrors] = React.useState<{ [cluster: string]: ApiError }>({});

    function setMetrics(metrics: { [cluster: string]: KubeMetrics[] }) {
      setNodeMetrics(metrics);
    }

    useConnectApi(
      fetchMetricsForClusters.bind(
        null,
        '/apis/metrics.k8s.io/v1beta1/nodes',
        setMetrics,
        setErrors
      )
    );

    return [nodeMetrics, errors];
  }

  isReady() {
    return this.status.conditions.find(
      condition => condition.type === 'Ready' && condition.status === 'True'
    );
  }
}

export default Node;

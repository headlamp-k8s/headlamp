import React from 'react';
import helpers, { DEFAULT_NODE_SHELL_LINUX_IMAGE } from '../../helpers';
import { getCluster, uniqueString, useErrorState } from '../util';
import { useConnectApi } from '.';
import { ApiError, metrics } from './apiProxy';
import { apply, stream, StreamResultsCb } from './apiProxy';
import { KubeCondition, KubeMetrics } from './cluster';
import { KubeObject, KubeObjectInterface } from './KubeObject';
import Pod, { KubePod } from './pod';

export interface KubeNode extends KubeObjectInterface {
  status: {
    addresses: {
      address: string;
      type: string;
    }[];
    allocatable: {
      cpu: any;
      memory: any;
      ephemeralStorage: any;
      hugepages_1Gi: any;
      hugepages_2Mi: any;
      pods: any;
    };
    capacity: {
      cpu: any;
      memory: any;
      ephemeralStorage: any;
      hugepages_1Gi: any;
      hugepages_2Mi: any;
      pods: any;
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
    taints: {
      key: string;
      effect: string;
    }[];
    [otherProps: string]: any;
  };
}

const shellPod = (name: string, nodeName: string, nodeShellImage: string) => {
  return {
    kind: 'Pod',
    apiVersion: 'v1',
    metadata: {
      name,
      namespace: 'kube-system',
    },
    spec: {
      nodeName,
      restartPolicy: 'Never',
      terminationGracePeriodSeconds: 0,
      hostPID: true,
      hostIPC: true,
      hostNetwork: true,
      tolerations: [
        {
          operator: 'Exists',
        },
      ],
      priorityClassName: 'system-node-critical',
      containers: [
        {
          name: 'shell',
          image: nodeShellImage,
          securityContext: {
            privileged: true,
          },
          command: ['nsenter'],
          args: ['-t', '1', '-m', '-u', '-i', '-n', 'sleep', '14000'],
        },
      ],
    },
  } as unknown as KubePod;
};

class Node extends KubeObject<KubeNode> {
  static kind = 'Node';
  static apiName = 'nodes';
  static apiVersion = 'v1';
  static isNamespaced = false;

  get status(): KubeNode['status'] {
    return this.jsonData.status;
  }

  get spec(): KubeNode['spec'] {
    return this.jsonData.spec;
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

  getExternalIP(): string {
    return this.status.addresses.find(address => address.type === 'ExternalIP')?.address || '';
  }

  getInternalIP(): string {
    return this.status.addresses.find(address => address.type === 'InternalIP')?.address || '';
  }

  async shell(onExec: StreamResultsCb) {
    const cluster = getCluster();
    if (!cluster) {
      return {};
    }

    const clusterSettings = helpers.loadClusterSettings(cluster);
    let image = clusterSettings.nodeShellLinuxImage ?? '';
    const podName = `node-shell-${this.getName()}-${uniqueString()}`;
    if (image === '') {
      image = DEFAULT_NODE_SHELL_LINUX_IMAGE;
    }
    console.log(image);
    const kubePod = shellPod(podName, this.getName(), image!!);
    await apply(kubePod);
    const command = [
      'sh',
      '-c',
      '((clear && bash) || (clear && zsh) || (clear && ash) || (clear && sh))',
    ];
    const tty = true;
    const stdin = true;
    const stdout = true;
    const stderr = true;
    const commandStr = command.map(item => '&command=' + encodeURIComponent(item)).join('');
    const url = `/api/v1/namespaces/kube-system/pods/${podName}/exec?container=shell${commandStr}&stdin=${
      stdin ? 1 : 0
    }&stderr=${stderr ? 1 : 0}&stdout=${stdout ? 1 : 0}&tty=${tty ? 1 : 0}`;
    const additionalProtocols = [
      'v4.channel.k8s.io',
      'v3.channel.k8s.io',
      'v2.channel.k8s.io',
      'channel.k8s.io',
    ];
    const onClose = () => {
      const pod = new Pod(kubePod);
      pod.delete();
    };
    return {
      stream: stream(url, onExec, { additionalProtocols, isJson: false }),
      onClose: onClose,
    };
  }
}

export default Node;

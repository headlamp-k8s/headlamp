const creationTimestamp = new Date('2022-01-01').toISOString();

export const NODE_DUMMY_DATA = [
  {
    kind: 'Node',
    apiVersion: 'v1',
    metadata: {
      name: 'node',
      namespace: 'default',
      creationTimestamp,
      uid: '123',
    },
    spec: {
      podCIDR: '',
      podCIDRs: [],
      providerID: '',
      taints: [],
      unschedulable: false,
    },
    status: {
      addresses: [],
      allocatable: {},
      conditions: [],
      daemonEndpoints: {},
      images: [],
      capacity: {
        cpu: '',
        ephemeralStorage: '',
        hugepages_1Gi: '',
        hugepages_2Mi: '',
        memory: '',
        pods: '',
      },
      nodeInfo: {
        architecture: '',
        bootID: '',
        containerRuntimeVersion: '',
        kernelVersion: '',
        kubeProxyVersion: '',
        kubeletVersion: '',
        machineID: '',
        operatingSystem: '',
        osImage: '',
        systemUUID: '',
      },
      phase: '',
    },
  },
];

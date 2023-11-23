import Container from '@mui/material/Container';
import { Meta, Story } from '@storybook/react/types-6-0';
import Node from '../../lib/k8s/node';
import { TestContext } from '../../test';
import List from './List';

Node.useList = () => {
  const objList = [
    {
      apiVersion: 'v1',
      kind: 'Node',
      metadata: {
        creationTimestamp: '2023-06-30T11:49:44Z',
        labels: {
          agentpool: 'agentpool',
          'kubernetes.io/arch': 'amd64',
          'kubernetes.io/hostname': 'my-hostname',
          'kubernetes.io/os': 'linux',
          'kubernetes.io/role': 'agent',
        },
        name: 'my-linux-node',
        resourceVersion: '123',
        uid: 'a123',
      },
      spec: {
        podCIDR: '10.244.0.0/24',
        podCIDRs: ['10.244.0.0/24'],
      },
      status: {
        addresses: [
          {
            address: '10.2.3.4',
            type: 'InternalIP',
          },
          {
            address: 'my-node-host',
            type: 'Hostname',
          },
        ],
        allocatable: {
          cpu: '3860m',
          memory: '12899332Ki',
          pods: '110',
        },
        capacity: {
          cpu: '4',
          memory: '16393220Ki',
          pods: '110',
        },
        conditions: [
          {
            lastHeartbeatTime: '2023-07-14T10:34:45Z',
            lastTransitionTime: '2023-07-12T16:06:25Z',
            message: 'kubelet is posting ready status.',
            reason: 'KubeletReady',
            status: 'True',
            type: 'Ready',
          },
        ],
        daemonEndpoints: {
          kubeletEndpoint: {
            Port: 10250,
          },
        },
        nodeInfo: {
          architecture: 'amd64',
          bootID: '12345',
          containerRuntimeVersion: 'containerd://1.5.11',
          kernelVersion: '5.4.0',
          kubeProxyVersion: 'v1.23.12',
          kubeletVersion: 'v1.23.12',
          machineID: 'b123',
          operatingSystem: 'linux',
          osImage: 'Debian 10 (buster)',
          systemUUID: '111',
        },
      },
    },
    {
      kind: 'Node',
      apiVersion: 'v1',
      metadata: {
        name: 'my-windows-node',
        uid: 'n1234',
        resourceVersion: 'u1234',
        creationTimestamp: '2023-07-13T23:28:40Z',
        labels: {
          'kubernetes.io/arch': 'amd64',
          'kubernetes.io/hostname': 'akswp01800001q',
          'kubernetes.io/os': 'windows',
          'kubernetes.io/role': 'agent',
          'node-role.kubernetes.io/agent': '',
          'node.kubernetes.io/windows-build': '10',
        },
      },
      status: {
        capacity: {
          cpu: '32',
          memory: '134217268Ki',
          pods: '30',
        },
        allocatable: {
          cpu: '31580m',
          memory: '122348084Ki',
          pods: '30',
        },
        conditions: [
          {
            type: 'Ready',
            status: 'True',
            lastHeartbeatTime: '2023-07-14T10:34:58Z',
            lastTransitionTime: '2023-07-13T23:45:57Z',
            reason: 'KubeletReady',
            message: 'kubelet is posting ready status',
          },
        ],
        addresses: [
          {
            type: 'InternalIP',
            address: '1.2.3.4',
          },
          {
            type: 'Hostname',
            address: 'windows-host',
          },
        ],
        daemonEndpoints: {
          kubeletEndpoint: {
            Port: 10250,
          },
        },
        nodeInfo: {
          machineID: 'win123',
          systemUUID: 'u12345',
          bootID: '123',
          kernelVersion: '10.0',
          osImage: 'Windows Server 2019 Datacenter',
          containerRuntimeVersion: 'containerd://1.6.21',
          kubeletVersion: 'v1.26.3',
          kubeProxyVersion: 'v1.26.3',
          operatingSystem: 'windows',
          architecture: 'amd64',
        },
      },
    },
  ].map((data: any) => new Node(data));
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'node/List',
  component: List,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: Story = () => {
  return (
    <Container maxWidth="xl">
      <List />
    </Container>
  );
};

export const Nodes = Template.bind({});

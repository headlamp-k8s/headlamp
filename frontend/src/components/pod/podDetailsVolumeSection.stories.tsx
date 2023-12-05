import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { KubeObjectInterface } from '../../lib/k8s/cluster';
import { TestContext } from '../../test';
import { VolumeSection, VolumeSectionProps } from '../common';

const dummyResource: KubeObjectInterface = {
  kind: 'Pod',
  apiVersion: 'v1',
  metadata: {
    name: 'kube-example',
    namespace: 'kube-system',
    uid: 'example text',
    resourceVersion: '1234',
    creationTimestamp: '2023-10-11T16:02:36Z',
  },
  spec: {
    volumes: [
      {
        name: 'ca-certs',
        hostPath: {
          path: '/etc/ssl/certs',
          type: 'DirectoryOrCreate',
        },
      },
      {
        name: 'etc-ca-certificates',
        hostPath: {
          path: '/etc/ca-certificates',
          type: 'DirectoryOrCreate',
        },
      },
      {
        name: 'flexvolume-dir',
        hostPath: {
          path: '/usr/libexec/kubernetes/kubelet-plugins/volume/exec',
          type: 'DirectoryOrCreate',
        },
      },
      {
        name: 'k8s-certs',
        hostPath: {
          path: '/var/lib/minikube/certs',
          type: 'DirectoryOrCreate',
        },
      },
      {
        name: 'kubeconfig',
        hostPath: {
          path: '/etc/kubernetes/controller-manager.conf',
          type: 'FileOrCreate',
        },
      },
      {
        name: 'usr-local-share-ca-certificates',
        hostPath: {
          path: '/usr/local/share/ca-certificates',
          type: 'DirectoryOrCreate',
        },
      },
      {
        name: 'usr-share-ca-certificates',
        hostPath: {
          path: '/usr/share/ca-certificates',
          type: 'DirectoryOrCreate',
        },
      },
    ],
  },
};

const dummyResourceShort: KubeObjectInterface = {
  kind: 'Pod',
  apiVersion: 'v1',
  metadata: {
    name: 'kube-example',
    namespace: 'kube-system',
    uid: 'example text',
    resourceVersion: '1234',
    creationTimestamp: '2023-10-11T16:02:36Z',
  },
  spec: {
    volumes: [
      {
        name: 'ca-certs',
        hostPath: {
          path: '/etc/ssl/certs',
          type: 'DirectoryOrCreate',
        },
      },
      {
        name: 'etc-ca-certificates',
        hostPath: {
          path: '/etc/ca-certificates',
          type: 'DirectoryOrCreate',
        },
      },
    ],
  },
};

const dummyResourceEmpty: KubeObjectInterface = {
  kind: 'Pod',
  apiVersion: 'v1',
  metadata: {
    name: 'kube-example',
    namespace: 'kube-system',
    uid: 'example text',
    resourceVersion: '1234',
    creationTimestamp: '2023-10-11T16:02:36Z',
  },
  spec: {
    volumes: [],
  },
};

export default {
  title: 'Pod/PodVolumeSectionDetailsView',
  component: VolumeSection,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
} as Meta;

const Template: Story<VolumeSectionProps> = args => {
  return (
    <TestContext>
      <VolumeSection {...args} />
    </TestContext>
  );
};

export const Successful = Template.bind({});
Successful.args = {
  resource: dummyResource,
};

export const Short = Template.bind({});
Short.args = {
  resource: dummyResourceShort,
};

export const Empty = Template.bind({});
Empty.args = {
  resource: dummyResourceEmpty,
};

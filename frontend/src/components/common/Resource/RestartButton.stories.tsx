import { Meta, StoryFn } from '@storybook/react';
import Deployment from '../../../lib/k8s/deployment';
import StatefulSet from '../../../lib/k8s/statefulSet';
import { TestContext } from '../../../test';
import { RestartButton } from './RestartButton';
export default {
  title: 'Resource/RestartButton',
  component: RestartButton,
  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof RestartButton> = args => <RestartButton {...args} />;

const mockDeployment = new Deployment({
  metadata: {
    name: 'mock-deployment',
    namespace: 'default',
    creationTimestamp: new Date().toDateString(),
    uid: 'mock-uid',
  },
  spec: {
    replicas: 3,
    template: {
      spec: {
        nodeName: 'mock-node',
        containers: [
          {
            name: 'mock-container',
            image: 'mock-image',
            ports: [{ containerPort: 80 }],
            imagePullPolicy: 'Always',
          },
        ],
      },
    },
  },
  status: {},
  kind: 'Deployment',
});

const mockStatefulSet = new StatefulSet({
  metadata: {
    name: 'mock-statefulset',
    namespace: 'default',
    creationTimestamp: new Date().toDateString(),
    uid: 'mock-uid',
  },
  spec: {
    replicas: 3,
    selector: {
      matchLabels: { app: 'headlamp' },
    },
    updateStrategy: {
      rollingUpdate: { partition: 1 },
      type: 'RollingUpdate',
    },
    template: {
      spec: {
        nodeName: 'mock-node',
        containers: [
          {
            name: 'mock-container',
            image: 'mock-image',
            ports: [{ containerPort: 80 }],
            imagePullPolicy: 'Always',
          },
        ],
      },
    },
    status: {},
  },
  status: {},
  kind: 'StatefulSet',
});

export const DeploymentExample = Template.bind({});
DeploymentExample.args = {
  item: mockDeployment,
};

export const StatefulSetExample = Template.bind({});
StatefulSetExample.args = {
  item: mockStatefulSet,
};

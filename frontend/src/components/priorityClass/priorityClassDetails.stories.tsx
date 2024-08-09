import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import { KubeObject, KubeObjectClass } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import PriorityClass, { KubePriorityClass } from '../../lib/k8s/priorityClass';
import { TestContext } from '../../test';
import HPADetails from './Details';

const usePhonyGet = useMockQuery.data(
  new PriorityClass({
    description: 'Mission Critical apps.',
    kind: 'PriorityClass',
    metadata: {
      annotations: {
        'kubectl.kubernetes.io/last-applied-configuration':
          '{"apiVersion":"scheduling.k8s.io/v1","description":"Mission Critical apps.","globalDefault":false,"kind":"PriorityClass","metadata":{"annotations":{},"name":"high-priority-apps"},"preemptionPolicy":"PreemptLowerPriority","value":1000000}\n',
      },
      selfLink: '',
      creationTimestamp: '2022-10-26T13:46:17Z',
      generation: 1,
      name: 'high-priority-apps',
      resourceVersion: '6474045',
      uid: '4cfbe956-a997-4b58-8ea3-18655d0ba8a9',
    },
    preemptionPolicy: 'PreemptLowerPriority',
    value: 1000000,
  } as KubePriorityClass)
);

export default {
  title: 'PriorityClass/PriorityClassDetailsView',
  component: HPADetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ namespace: 'my-namespace', name: 'my-endpoint' }}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

interface MockerStory {
  useQuery?: KubeObjectClass['useQuery'];
  allowEdit?: boolean;
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useQuery) {
    PriorityClass.useQuery = args.useQuery;
    Event.objectEvents = async (obj: KubeObject) => {
      console.log('object:', obj);
      return [];
    };
  }
  if (!!args.allowEdit) {
    PriorityClass.getAuthorization = () => {
      return { status: { allowed: true, reason: '', code: 200 } };
    };
  }

  return <HPADetails />;
};

export const Default = Template.bind({});
Default.args = {
  useQuery: usePhonyGet,
  allowEdit: true,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  useQuery: useMockQuery.noData,
};

export const Error = Template.bind({});
Error.args = {
  useQuery: useMockQuery.error,
};

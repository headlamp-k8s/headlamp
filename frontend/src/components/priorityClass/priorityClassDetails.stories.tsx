import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import { KubeObject } from '../../lib/k8s/cluster';
import Event from '../../lib/k8s/event';
import PriorityClasses, { KubePriorityClasses } from '../../lib/k8s/priorityClasses';
import { TestContext } from '../../test';
import HPADetails from './Details';

const usePhonyGet: KubeObjectClass['useGet'] = () => {
  return [
    new PriorityClasses({
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
    } as KubePriorityClasses),
  ] as any;
};

export default {
  title: 'PriorityClasses/PriorityClassesDetailsView',
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
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useGet) {
    PriorityClasses.useGet = args.useGet;
    Event.objectEvents = async (obj: KubeObject) => {
      console.log('object:', obj);
      return [];
    };
  }
  if (!!args.useList) {
    PriorityClasses.useList = args.useList;
  }

  return <HPADetails />;
};

export const Default = Template.bind({});
Default.args = {
  useGet: usePhonyGet,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  useGet: () => [null, null, () => {}, () => {}] as any,
};

export const Error = Template.bind({});
Error.args = {
  useGet: () => [null, 'Phony error is phony!', () => {}, () => {}] as any,
};

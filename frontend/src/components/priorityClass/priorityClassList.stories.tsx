import { Meta, Story } from '@storybook/react/types-6-0';
import PriorityClass, { KubePriorityClass } from '../../lib/k8s/priorityClass';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import PriorityClassList from './List';

PriorityClass.useList = () => {
  const objList = generateK8sResourceList<KubePriorityClass>(
    {
      description: 'Mission Critical apps.',
      kind: 'PriorityClass',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration':
            '{"apiVersion":"scheduling.k8s.io/v1","description":"Mission Critical apps.","globalDefault":false,"kind":"PriorityClass","metadata":{"annotations":{},"name":"high-priority-apps"},"preemptionPolicy":"PreemptLowerPriority","value":1000000}\n',
        },
        creationTimestamp: '2022-10-26T13:46:17Z',
        generation: 1,
        name: 'high-priority-apps',
        resourceVersion: '6474045',
        uid: '4cfbe956-a997-4b58-8ea3-18655d0ba8a9',
      },
      preemptionPolicy: 'PreemptLowerPriority',
      value: 1000000,
    },
    { instantiateAs: PriorityClass }
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'PriorityClass/PriorityClassListView',
  component: PriorityClassList,
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
  return <PriorityClassList />;
};

export const Items = Template.bind({});

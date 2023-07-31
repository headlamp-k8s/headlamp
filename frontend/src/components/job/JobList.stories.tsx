import { Meta, Story } from '@storybook/react/types-6-0';
import Job from '../../lib/k8s/job';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import List from './List';
import { jobs } from './storyHelper';

Job.useList = () => {
  const jobList = generateK8sResourceList(jobs[0], { numResults: 3 });

  const failedJob = jobList[1];
  failedJob.status = {
    ...failedJob.status,
    conditions: [
      {
        type: 'Failed',
        status: 'True',
        lastProbeTime: '2023-07-28T08:01:00Z',
        lastTransitionTime: '2023-07-28T08:01:00Z',
      },
    ],
  };

  const suspendedJob = jobList[2];
  suspendedJob.status = {
    ...suspendedJob.status,
    conditions: [
      {
        type: 'Suspended',
        status: 'True',
        lastProbeTime: '2023-07-28T08:01:00Z',
        lastTransitionTime: '2023-07-28T08:01:00Z',
      },
    ],
  };

  const objList = jobList.map(data => new Job(data));

  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'Job/List',
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
  return <List />;
};

export const Items = Template.bind({});

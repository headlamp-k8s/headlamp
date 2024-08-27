import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import List from './List';
import { jobs } from './storyHelper';

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
  parameters: {
    msw: {
      handlers: {
        story: [
          http.get('http://localhost:4466/apis/batch/v1/jobs', () =>
            HttpResponse.json({
              kind: 'JobsList',
              metadata: {},
              items: jobList,
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <List />;
};

export const Items = Template.bind({});

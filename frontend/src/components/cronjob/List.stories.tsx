import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './List';
import { cronJobList } from './storyHelper';

export default {
  title: 'CronJob/CronJobListView',
  component: ListView,
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
        storyBase: [],
        story: [
          http.get('http://localhost:4466/apis/batch/v1/jobs', () => HttpResponse.error()),
          http.get('http://localhost:4466/apis/batch/v1beta1/cronjobs', () => HttpResponse.error()),
          http.get('http://localhost:4466/apis/batch/v1/cronjobs', () =>
            HttpResponse.json({
              kind: 'CronJobList',
              items: cronJobList,
              metadata: {},
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <ListView />;
};

export const Items = Template.bind({});

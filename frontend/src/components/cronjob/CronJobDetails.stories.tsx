import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import CronJobDetails from './Details';
import { cronJobList } from './storyHelper';

export default {
  title: 'CronJob/CronJobDetailsView',
  component: CronJobDetails,
  argTypes: {},
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get('http://localhost:4466/api/v1/namespaces/default/events', () =>
            HttpResponse.json({
              kind: 'EventList',
              items: [],
              metadata: {},
            })
          ),
          http.get('http://localhost:4466/apis/batch/v1/namespaces/default/jobs', () =>
            HttpResponse.json({
              kind: 'JobsList',
              metadata: {},
              items: [],
            })
          ),
          http.get('http://localhost:4466/apis/batch/v1beta1/cronjobs', () => HttpResponse.error()),
          http.get('http://localhost:4466/apis/batch/v1/jobs', () => HttpResponse.error()),
        ],
      },
    },
  },
} as Meta;

interface MockerStory {
  cronJobName: string;
}

const Template: StoryFn<MockerStory> = args => {
  const { cronJobName } = args;

  return (
    <TestContext routerMap={{ namespace: 'default', name: cronJobName }}>
      <CronJobDetails />
    </TestContext>
  );
};

export const EveryMinute = Template.bind({});
EveryMinute.args = {
  cronJobName: 'every-minute',
};
EveryMinute.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/batch/v1/namespaces/default/cronjobs/every-minute',
          () => HttpResponse.json(cronJobList.find(it => it.metadata.name === 'every-minute'))
        ),
      ],
    },
  },
};

export const EveryAst = Template.bind({});
EveryAst.args = {
  cronJobName: 'every-minute-one-char',
};
EveryAst.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/batch/v1/namespaces/default/cronjobs/every-minute-one-char',
          () =>
            HttpResponse.json(cronJobList.find(it => it.metadata.name === 'every-minute-one-char'))
        ),
      ],
    },
  },
};

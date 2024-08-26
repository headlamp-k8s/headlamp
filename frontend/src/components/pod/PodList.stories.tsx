import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import PodList from './List';
import { podList } from './storyHelper';

export default {
  title: 'Pod/PodListView',
  component: PodList,
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
          http.get('http://localhost:4466/api/v1/pods', () =>
            HttpResponse.json({
              kind: 'PodList',
              apiVersion: 'v1',
              metadata: {},
              items: podList,
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <PodList />;
};

export const Items = Template.bind({});

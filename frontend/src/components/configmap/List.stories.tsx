import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './List';
import { BASE_CONFIG_MAP, BASE_EMPTY_CONFIG_MAP } from './storyHelper';

export default {
  title: 'ConfigMap/ListView',
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
          http.get('http://localhost:4466/api/v1/configmaps', () =>
            HttpResponse.json({
              kind: 'ConfigMapList',
              items: [BASE_CONFIG_MAP, BASE_EMPTY_CONFIG_MAP],
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

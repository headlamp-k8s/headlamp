import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './HTTPRouteList';
import { DEFAULT_HTTP_ROUTE } from './storyHelper';

export default {
  title: 'HTTPRoute/ListView',
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
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/httproutes', () =>
            HttpResponse.json({
              kind: 'HTTPRouteList',
              metadata: {},
              items: [DEFAULT_HTTP_ROUTE],
            })
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/httproutes', () =>
            HttpResponse.error()
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

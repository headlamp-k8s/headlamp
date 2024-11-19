import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './GatewayList';
import { DEFAULT_GATEWAY } from './storyHelper';

export default {
  title: 'Gateway/ListView',
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
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/gateways', () =>
            HttpResponse.json({
              kind: 'GatewayList',
              metadata: {},
              items: [DEFAULT_GATEWAY],
            })
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/gateways', () =>
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

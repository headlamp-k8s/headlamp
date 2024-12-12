import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { DEFAULT_GATEWAY_CLASS } from './storyHelper';

export default {
  title: 'GatewayClass/ListView',
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
        story: [
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/gatewayclasses', () =>
            HttpResponse.json({
              kind: 'GatewayClassList',
              metadata: {},
              items: [DEFAULT_GATEWAY_CLASS],
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

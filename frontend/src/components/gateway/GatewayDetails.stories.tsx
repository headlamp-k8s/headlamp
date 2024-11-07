import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import GatewayDetails from './GatewayDetails';
import { DEFAULT_GATEWAY } from './storyHelper';

export default {
  title: 'Gateway/DetailsView',
  component: GatewayDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'default-gateway' }}>
          <Story />
        </TestContext>
      );
    },
  ],
  parameters: {
    msw: {
      handlers: {
        baseStory: [
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/gateways', () =>
            HttpResponse.json({})
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/gateways', () =>
            HttpResponse.error()
          ),
          http.get('http://localhost:4466/api/v1/namespaces/default/events', () =>
            HttpResponse.json({
              kind: 'EventList',
              items: [],
              metadata: {},
            })
          ),
          http.post(
            'http://localhost:4466/apis/authorization.k8s.io/v1/selfsubjectaccessreviews',
            () => HttpResponse.json({ status: { allowed: true, reason: '', code: 200 } })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <GatewayDetails />;
};

export const Basic = Template.bind({});
Basic.args = {
  gatewayJson: DEFAULT_GATEWAY,
};
Basic.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/gateways/default-gateway',
          () => HttpResponse.json(DEFAULT_GATEWAY)
        ),
      ],
    },
  },
};

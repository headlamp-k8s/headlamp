import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import Details from './ClassDetails';
import { DEFAULT_GATEWAY_CLASS } from './storyHelper';

export default {
  title: 'GatewayClass/DetailsView',
  component: Details,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'default-gateway-class' }}>
          <Story />
        </TestContext>
      );
    },
  ],
  parameters: {
    msw: {
      handlers: {
        story: [],
        storyBase: [
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/gatewayclasses', () =>
            HttpResponse.json({})
          ),
          http.get(
            'http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/gatewayclasses',
            () => HttpResponse.error()
          ),
          http.get(
            'http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/gatewayclasses',
            () => HttpResponse.error()
          ),
          http.get('http://localhost:4466/api/v1/namespaces/default/events', () =>
            HttpResponse.json({
              kind: 'EventList',
              items: [],
              metadata: {},
            })
          ),
          http.get(
            'http://localhost:4466/apis/gateway.networking.k8s.io/v1/gatewayclasses/default-gateway-class',
            () => HttpResponse.json(DEFAULT_GATEWAY_CLASS)
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <Details />;
};

export const Basic = Template.bind({});
Basic.args = {
  gatewayJson: DEFAULT_GATEWAY_CLASS,
};

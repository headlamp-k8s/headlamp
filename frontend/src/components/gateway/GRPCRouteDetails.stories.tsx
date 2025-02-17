import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import GRPCRouteDetails from './GRPCRouteDetails';
import { DEFAULT_GRPC_ROUTE } from './storyHelper';

export default {
  title: 'GRPCRoute/DetailsView',
  component: GRPCRouteDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'default-grpcroute' }}>
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
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/grpcroutes', () =>
            HttpResponse.json({})
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/grpcroutes', () =>
            HttpResponse.error()
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/grpcroutes', () =>
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
  return <GRPCRouteDetails />;
};

export const Basic = Template.bind({});
Basic.args = {
  grpcRouteJson: DEFAULT_GRPC_ROUTE,
};
Basic.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/apis/gateway.networking.k8s.io/v1/grpcroutes/default-grpcroute',
          () => HttpResponse.json(DEFAULT_GRPC_ROUTE)
        ),
      ],
    },
  },
};

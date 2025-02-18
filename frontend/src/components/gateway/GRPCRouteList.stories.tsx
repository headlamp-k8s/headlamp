import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './GRPCRouteList';
import { DEFAULT_GRPC_ROUTE } from './storyHelper';

export default {
  title: 'GRPCRoute/ListView',
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
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/grpcroutes', () =>
            HttpResponse.json({
              kind: 'GRPCRouteList',
              metadata: {},
              items: [DEFAULT_GRPC_ROUTE],
            })
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1/grpcroutes', () =>
            HttpResponse.error()
          ),
          http.get('http://localhost:4466/apis/gateway.networking.k8s.io/v1beta1/grpcroutes', () =>
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

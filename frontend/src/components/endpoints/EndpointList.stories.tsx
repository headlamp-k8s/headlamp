import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import EndpointList from './List';

const list = [
  {
    kind: 'Endpoints',
    apiVersion: 'v1',
    metadata: {
      namespace: '',
      creationTimestamp: new Date('2022-01-01').toISOString(),
    },
    subsets: [
      {
        addresses: [
          {
            ip: '127.0.01',
            nodeName: 'mynode',
            targetRef: {
              kind: 'Pod',
              namespace: 'my-namespace',
              name: 'mypod',
              uid: 'phony-pod',
              resourceVersion: '1',
              apiVersion: 'v1',
            },
          },
        ],
        ports: [
          {
            name: 'myport',
            port: 8080,
            protocol: 'TCP',
          },
        ],
      },
    ],
  },
];

export default {
  title: 'endpoints/EndpointsListView',
  component: EndpointList,
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
          http.get('http://localhost:4466/api/v1/endpoints', () =>
            HttpResponse.json({
              kind: 'EndpointsList',
              items: list,
              metadata: {},
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <EndpointList />;
};

export const Items = Template.bind({});

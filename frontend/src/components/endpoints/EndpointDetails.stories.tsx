import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import EndpointDetails from './Details';

export default {
  title: 'endpoints/EndpointsDetailsView',
  component: EndpointDetails,
  argTypes: {},
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get('http://localhost:4466/api/v1/endpoints', () => HttpResponse.error()),
          http.get('http://localhost:4466/api/v1/namespaces/my-namespace/events', () =>
            HttpResponse.error()
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return (
    <TestContext routerMap={{ namespace: 'my-namespace', name: 'my-endpoint' }}>
      <EndpointDetails />
    </TestContext>
  );
};

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/namespaces/my-namespace/endpoints/my-endpoint', () =>
          HttpResponse.json({
            kind: 'Endpoints',
            apiVersion: 'v1',
            metadata: {
              name: 'my-endpoint',
              namespace: 'my-namespace',
              uid: 'phony',
              creationTimestamp: new Date('2020-04-25').toISOString(),
              resourceVersion: '1',
              selfLink: '0',
            },
            subsets: [
              {
                addresses: [
                  {
                    ip: '127.0.0.1',
                    nodeName: 'mynode',
                    targetRef: {
                      kind: 'Pod',
                      namespace: 'MyNamespace',
                      name: 'mypod',
                      uid: 'phony-pod',
                      resourceVersion: '1',
                      apiVersion: 'v1',
                    },
                  },
                  {
                    ip: '127.0.0.2',
                    nodeName: 'mynode',
                    targetRef: {
                      kind: 'Pod',
                      namespace: 'MyNamespace',
                      name: 'mypod-1',
                      uid: 'phony-pod-1',
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
          })
        ),
      ],
    },
  },
};

export const Error = Template.bind({});
Error.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/namespaces/my-namespace/endpoints/my-endpoint', () =>
          HttpResponse.error()
        ),
      ],
    },
  },
};

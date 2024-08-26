import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ResourceQuotaDetails from './Details';

const item = {
  apiVersion: 'v1',
  kind: 'ResourceQuota',
  metadata: {
    annotations: {
      'kubectl.kubernetes.io/last-applied-configuration':
        '{"apiVersion":"v1","kind":"ResourceQuota","metadata":{"annotations":{},"name":"test-cpu-quota","namespace":"test"},"spec":{"hard":{"limits.cpu":"300m","requests.cpu":"200m"}}}\n',
    },
    selfLink: '',
    creationTimestamp: '2022-10-25T11:48:48Z',
    name: 'test-cpu-quota',
    namespace: 'test',
    resourceVersion: '6480949',
    uid: 'ebee95aa-f0a2-43d7-bd27-c7e756d0b163',
  },
  spec: {
    hard: {
      'limits.cpu': '300m',
      'requests.cpu': '200m',
    },
  },
  status: {
    hard: {
      'limits.cpu': '300m',
      'requests.cpu': '200m',
    },
    used: {
      'limits.cpu': '0',
      'requests.cpu': '500m',
    },
  },
};

export default {
  title: 'ResourceQuota/ResourceQuotaDetailsView',
  component: ResourceQuotaDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ namespace: 'my-namespace', name: 'my-endpoint' }}>
          <Story />
        </TestContext>
      );
    },
  ],
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get('http://localhost:4466/api/v1/resourcequotas', () => HttpResponse.error()),
          http.get('http://localhost:4466/api/v1/namespaces/test/events', () =>
            HttpResponse.error()
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <ResourceQuotaDetails />;
};

export const Default = Template.bind({});
Default.parameters = {
  msw: {
    handlers: {
      story: [
        http.get(
          'http://localhost:4466/api/v1/namespaces/my-namespace/resourcequotas/my-endpoint',
          () => HttpResponse.json(item)
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
        http.get(
          'http://localhost:4466/api/v1/namespaces/my-namespace/resourcequotas/my-endpoint',
          () => HttpResponse.error()
        ),
      ],
    },
  },
};

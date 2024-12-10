import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { KubeNamespace } from '../../lib/k8s/namespace';
import { TestContext } from '../../test';
import NamespaceDetails from './Details';

const createObj = (name: string) =>
  ({
    kind: 'Namespace',
    apiVersion: 'v1',
    metadata: {
      name,
      uid: '1234567890',
      creationTimestamp: '2023-01-01T00:00:00Z',
    },
    spec: {
      finalizers: ['kubernetes'],
    },
    status: {
      phase: 'Active',
    },
  } as KubeNamespace);

export default {
  title: 'Namespace/DetailsView',
  component: NamespaceDetails,
  argTypes: {},
  decorators: [
    Story => {
      return <Story />;
    },
  ],
} as Meta;

interface MockerStory {
  namespace: string;
}

const Template: StoryFn<MockerStory> = args => {
  const { namespace } = args;

  return (
    <TestContext routerMap={{ namespace: 'default', name: namespace }}>
      <NamespaceDetails />;
    </TestContext>
  );
};

export const Active = Template.bind({});
Active.args = {
  namespace: 'my-namespace',
};
Active.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/namespaces/my-namespace', () =>
          HttpResponse.json(createObj('my-namespaces'))
        ),
        http.get('http://localhost:4466/api/v1/namespaces/my-namespaces/resourcequotas', () =>
          HttpResponse.json({ kind: 'List', items: [], metadata: {} })
        ),
        http.get('http://localhost:4466/api/v1/namespaces/my-namespaces/limitranges', () =>
          HttpResponse.json({ kind: 'List', items: [], metadata: {} })
        ),
        http.get('http://localhost:4466/api/v1/namespaces/my-namespaces/pods', () =>
          HttpResponse.json({ kind: 'List', items: [], metadata: {} })
        ),
        http.get('http://localhost:4466/api/v1/resourcequotas', () => HttpResponse.error()),
        http.get('http://localhost:4466/api/v1/limitranges', () => HttpResponse.error()),
        http.get('http://localhost:4466/api/v1/pods', () => HttpResponse.error()),
        http.get(
          'http://localhost:4466/apis/metrics.k8s.io/v1beta1/namespaces/my-namespaces/pods',
          () =>
            HttpResponse.json({
              kind: 'PodMetricsList',
              apiVersion: 'metrics.k8s.io/v1beta1',
              metadata: {},
              items: [
                {
                  metadata: {
                    name: 'successful',
                  },
                  containers: [
                    {
                      name: 'etcd',
                      usage: {
                        cpu: '16317640n',
                        memory: '47544Ki',
                      },
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

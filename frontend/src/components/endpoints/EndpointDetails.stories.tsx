import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import Endpoints, { KubeEndpoint } from '../../lib/k8s/endpoints';
import { TestContext } from '../../test';
import EndpointDetails from './Details';

const usePhonyQuery: KubeObjectClass['useQuery'] = ({ name, namespace }: any): any => {
  return {
    data: new Endpoints({
      kind: 'Endpoints',
      apiVersion: 'v1',
      metadata: {
        name,
        namespace,
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
    } as KubeEndpoint),
    error: null,
  };
};

export default {
  title: 'endpoints/EndpointsDetailsView',
  component: EndpointDetails,
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
} as Meta;

interface MockerStory {
  usePhonyQuery?: KubeObjectClass['usePhonyQuery'];
}

const Template: Story = (args: MockerStory) => {
  if (!!args.usePhonyQuery) {
    Endpoints.useQuery = args.usePhonyQuery;
  }

  return (
    <TestContext>
      <EndpointDetails />
    </TestContext>
  );
};

export const Default = Template.bind({});
Default.args = {
  usePhonyQuery: usePhonyQuery,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  usePhonyQuery: useMockQuery.noData,
};

export const Error = Template.bind({});
Error.args = {
  usePhonyQuery: useMockQuery.error,
};

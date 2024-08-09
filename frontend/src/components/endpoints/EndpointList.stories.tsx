import { Meta, Story } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import Endpoints, { KubeEndpoint } from '../../lib/k8s/endpoints';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import EndpointList from './List';

Endpoints.useListQuery = useMockListQuery.data(
  generateK8sResourceList<KubeEndpoint>(
    {
      kind: 'Endpoints',
      apiVersion: 'v1',
      metadata: {
        namespace: '',
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
    { instantiateAs: Endpoints }
  )
);

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
} as Meta;

const Template: Story = () => {
  return <EndpointList />;
};

export const Items = Template.bind({});

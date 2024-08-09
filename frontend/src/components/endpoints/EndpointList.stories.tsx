import { Meta, Story } from '@storybook/react';
import Endpoint from '../../lib/k8s/endpoints';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import EndpointList from './List';

Endpoint.useList = () => {
  const objList = generateK8sResourceList(
    {
      kind: 'Endpoints',
      apiVersion: 'v1',
      metadata: {
        name: '',
        namespace: '',
        uid: '',
        creationTimestamp: '',
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
    { instantiateAs: Endpoint }
  );

  return [objList, null, () => {}, () => {}] as any;
};

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

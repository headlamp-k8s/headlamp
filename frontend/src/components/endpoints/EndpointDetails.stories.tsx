import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import Endpoints, { KubeEndpoint } from '../../lib/k8s/endpoints';
import { TestContext } from '../../test';
import EndpointDetails from './Details';

const usePhonyGet: KubeObjectClass['useGet'] = (name, namespace) => {
  return [
    new Endpoints({
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
    null,
    () => {},
    () => {},
  ] as any;
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
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useGet) {
    Endpoints.useGet = args.useGet;
  }
  if (!!args.useList) {
    Endpoints.useList = args.useList;
  }

  return (
    <TestContext>
      <EndpointDetails />
    </TestContext>
  );
};

export const Default = Template.bind({});
Default.args = {
  useGet: usePhonyGet,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  useGet: () => [null, null, () => {}, () => {}] as any,
};

export const Error = Template.bind({});
Error.args = {
  useGet: () => [null, 'Phony error is phony!', () => {}, () => {}] as any,
};

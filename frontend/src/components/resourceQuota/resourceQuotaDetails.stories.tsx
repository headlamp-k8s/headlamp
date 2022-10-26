import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import ResourceQuota, { KubeResourceQuota } from '../../lib/k8s/resourceQuota';
import { TestContext } from '../../test';
import ResourceQuotaDetails from './Details';

const usePhonyGet: KubeObjectClass['useGet'] = () => {
  return [
    new ResourceQuota({
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
    } as KubeResourceQuota),
  ] as any;
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
} as Meta;

interface MockerStory {
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useGet) {
    ResourceQuota.useGet = args.useGet;
  }
  if (!!args.useList) {
    ResourceQuota.useList = args.useList;
  }

  return <ResourceQuotaDetails />;
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

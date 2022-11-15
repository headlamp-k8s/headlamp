import { Meta, Story } from '@storybook/react/types-6-0';
import ResourceQuota, { KubeResourceQuota } from '../../lib/k8s/resourceQuota';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import ResourceQuotaList from './List';

ResourceQuota.useList = () => {
  const objList = generateK8sResourceList<KubeResourceQuota>(
    {
      kind: 'ResourceQuota',
      metadata: {
        annotations: {
          'kubectl.kubernetes.io/last-applied-configuration':
            '{"apiVersion":"v1","kind":"ResourceQuota","metadata":{"annotations":{},"name":"test-cpu-quota","namespace":"test"},"spec":{"hard":{"limits.cpu":"300m","requests.cpu":"200m"}}}\n',
        },
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
    },
    { instantiateAs: ResourceQuota }
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'ResourceQuota/ResourceQuotaListView',
  component: ResourceQuotaList,
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
  return <ResourceQuotaList />;
};

export const Items = Template.bind({});

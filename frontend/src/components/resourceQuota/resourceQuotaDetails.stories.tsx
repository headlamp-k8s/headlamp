import { Meta, Story } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import ResourceQuota, { KubeResourceQuota } from '../../lib/k8s/resourceQuota';
import { TestContext } from '../../test';
import ResourceQuotaDetails from './Details';

const usePhonyQuery = useMockQuery.data(
  new ResourceQuota({
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
  } as KubeResourceQuota)
);

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
  useQuery?: KubeObjectClass['useQuery'];
  allowEdit?: boolean;
}

const Template: Story = (args: MockerStory) => {
  if (!!args.useQuery) {
    ResourceQuota.useQuery = args.useQuery;
  }
  if (!!args.allowEdit) {
    ResourceQuota.getAuthorization = () => ({
      status: { allowed: true, reason: '', code: 200 },
    });
  }

  return <ResourceQuotaDetails />;
};

export const Default = Template.bind({});
Default.args = {
  useQuery: usePhonyQuery,
  allowEdit: true,
};

export const NoItemYet = Template.bind({});
NoItemYet.args = {
  useQuery: useMockQuery.noData,
};

export const Error = Template.bind({});
Error.args = {
  useQuery: useMockQuery.error,
};

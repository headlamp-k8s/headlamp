import { Meta, Story } from '@storybook/react';
import { KubeMetadata } from '../../lib/k8s/cluster';
import Namespace from '../../lib/k8s/namespace';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import NamespacesList from './List';

Namespace.useList = () => {
  const objList = generateK8sResourceList(
    {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {} as KubeMetadata,
      spec: {
        finalizers: ['kubernetes'],
      },
      status: {
        phase: 'Active',
      },
    },
    { instantiateAs: Namespace }
  );
  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'Namespace/ListView',
  component: NamespacesList,
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
  return <NamespacesList />;
};

export const Regular = Template.bind({});

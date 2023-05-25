import { Meta, Story } from '@storybook/react/types-6-0';
import Namespace, { KubeNamespace } from '../../lib/k8s/namespace';
import { TestContext } from '../../test';
import { generateK8sResourceList } from '../../test/mocker';
import NamespacesList from './List';

Namespace.useList = () => {
  const objList = generateK8sResourceList<KubeNamespace>(
    {
      kind: 'Namespace',
      apiVersion: 'v1',
      metadata: {},
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

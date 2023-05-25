import { Meta, Story } from '@storybook/react/types-6-0';
import Namespace, { KubeNamespace } from '../../lib/k8s/namespace';
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

Namespace.useGet = name => {
  return [new Namespace(createObj(name)), null, () => {}, () => {}] as any;
};

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

const Template: Story<MockerStory> = args => {
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

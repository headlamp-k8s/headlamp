import { Meta, Story } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import StorageClass from '../../lib/k8s/storageClass';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { BASE_SC } from './storyHelper';

StorageClass.useListQuery = useMockListQuery.data(
  [BASE_SC].map((data: KubeObject) => new StorageClass(data))
);

export default {
  title: 'StorageClass/ListView',
  component: ListView,
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
  return <ListView />;
};

export const Items = Template.bind({});

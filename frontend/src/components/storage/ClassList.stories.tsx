import { Meta, Story } from '@storybook/react';
import { KubeObject } from '../../lib/k8s/cluster';
import StorageClass from '../../lib/k8s/storageClass';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { BASE_SC } from './storyHelper';

StorageClass.useList = () => {
  const objList = [BASE_SC].map((data: KubeObject) => new StorageClass(data));

  return [objList, null, () => {}, () => {}] as any;
};

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

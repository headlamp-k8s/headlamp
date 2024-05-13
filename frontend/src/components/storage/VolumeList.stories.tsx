import { Meta, Story } from '@storybook/react';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { BASE_PV } from './storyHelper';

PersistentVolume.useList = () => {
  const objList = [BASE_PV].map(data => new PersistentVolume(data));

  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'PersistentVolume/ListView',
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

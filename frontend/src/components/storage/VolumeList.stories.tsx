import { Meta, Story } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import PersistentVolume from '../../lib/k8s/persistentVolume';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { BASE_PV } from './storyHelper';

PersistentVolume.useListQuery = useMockListQuery.data(
  [BASE_PV].map((data: KubeObject) => new PersistentVolume(data))
);

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

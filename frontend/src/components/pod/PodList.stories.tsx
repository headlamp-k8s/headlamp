import { Meta, Story } from '@storybook/react/types-6-0';
import Pod from '../../lib/k8s/pod';
import { TestContext } from '../../test';
import PodList from './List';
import { podList } from './storyHelper';

Pod.useList = () => {
  const objList = podList.map(data => new Pod(data));

  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'Pod/PodListView',
  component: PodList,
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
  return <PodList />;
};

export const Items = Template.bind({});

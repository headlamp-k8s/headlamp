import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../test';
import { NetworkPolicyList } from './List';

export default {
  title: 'NetworkPolicy/Listview',
  component: NetworkPolicyList,
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

const Template: StoryFn = () => {
  return <NetworkPolicyList />;
};

export const Default = Template.bind({});

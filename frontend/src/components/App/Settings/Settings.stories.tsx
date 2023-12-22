import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../../test';
import Settings from '.';

export default {
  title: 'Settings',
  component: Settings,
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
  return <Settings />;
};

export const General = Template.bind({});

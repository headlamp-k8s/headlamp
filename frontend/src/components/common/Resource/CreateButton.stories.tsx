import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../../test';
import CreateButton from './CreateButton';

export default {
  title: 'Resource/CreateButton',
  component: CreateButton,
  argTypes: {},
  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof CreateButton> = args => <CreateButton {...args} />;

export const Default = Template.bind({});
Default.args = {
  isNarrow: false,
};

export const NarrowButton = Template.bind({});
NarrowButton.args = {
  isNarrow: true,
};

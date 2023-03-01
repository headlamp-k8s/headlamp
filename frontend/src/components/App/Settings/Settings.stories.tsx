import { Meta, Story } from '@storybook/react/types-6-0';
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

const Template: Story = () => {
  return <Settings />;
};

export const General = Template.bind({});

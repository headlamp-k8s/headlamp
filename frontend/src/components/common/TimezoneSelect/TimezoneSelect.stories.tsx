import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../../test';
import TimezoneSelect from './TimezoneSelect';

export default {
  title: 'TimezoneSelect',
  component: TimezoneSelect,
  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof TimezoneSelect> = args => <TimezoneSelect {...args} />;

export const Default = Template.bind({});
Default.args = {
  initialTimezone: 'America/New_York',
  onChange: (timezone: string) => {
    console.log(`Timezone changed to: ${timezone}`);
  },
};

export const NoInitialValue = Template.bind({});
NoInitialValue.args = {
  onChange: (timezone: string) => {
    console.log('Timezone changed:', timezone);
  },
};

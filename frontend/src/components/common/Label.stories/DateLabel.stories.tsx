import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { DateLabel as DateLabelComponent, DateLabelProps } from '../Label';

// NOTE: see TIMEAGO in frontend/src/lib/util.ts can pass options.now to format.

export default {
  title: 'Label',
  component: DateLabelComponent,
  argTypes: {},
} as Meta;

const Template: Story<DateLabelProps> = (args) => (
  <DateLabelComponent {...args} />
);

export const DateLabelString = Template.bind({});
DateLabelString.args = {
  date: '2020-12-17T03:24:00',
};
export const DateLabelNumber = Template.bind({});
DateLabelString.args = {
  date: 1609929953,
};

export const DateLabelDate = Template.bind({});
DateLabelString.args = {
  date: new Date(2020, 11, 17),
};

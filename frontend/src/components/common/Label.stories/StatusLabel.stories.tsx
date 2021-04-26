import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { StatusLabel as StatusLabelComponent, StatusLabelProps } from '../Label';

export default {
  title: 'Label/StatusLabel',
  component: StatusLabelComponent,
  argTypes: {},
} as Meta;

const Template: Story<StatusLabelProps> = args => (
  <StatusLabelComponent {...args}>{args.status}</StatusLabelComponent>
);

export const Success = Template.bind({
  component: StatusLabelComponent,
});
Success.args = {
  status: 'success',
};

export const Error = Template.bind({
  component: StatusLabelComponent,
});
Error.args = {
  status: 'error',
};

export const Warning = Template.bind({
  component: StatusLabelComponent,
});
Warning.args = {
  status: 'warning',
};

import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { StatusLabel as StatusLabelComponent, StatusLabelProps } from '../Label';

export default {
  title: 'Label',
  component: StatusLabelComponent,
  argTypes: {},
} as Meta;

const Template: Story<StatusLabelProps> = args => (
  <StatusLabelComponent {...args}>status</StatusLabelComponent>
);

export const StatusLabel = Template.bind({
  component: StatusLabelComponent,
});
StatusLabel.args = {
  status: 'success',
};

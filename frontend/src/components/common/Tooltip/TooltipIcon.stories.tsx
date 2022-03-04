import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import TooltipIcon, { TooltipIconProps } from './TooltipIcon';

export default {
  title: 'Tooltip/TooltipIcon',
  component: TooltipIcon,
} as Meta;

const Template: Story<TooltipIconProps> = args => <TooltipIcon {...args} />;

export const JustText = Template.bind({});
JustText.args = {
  children: 'This is the text',
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  children: 'Some other text',
  icon: 'mdi:plus-circle',
};

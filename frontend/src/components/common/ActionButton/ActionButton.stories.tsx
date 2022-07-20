import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import ActionButton, { ActionButtonProps } from './ActionButton';

export default {
  title: 'common/ActionButton',
  component: ActionButton,
  argTypes: {},
} as Meta;

const Template: Story<ActionButtonProps> = args => <ActionButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  description: 'Some label',
  icon: 'mdi:pencil',
};

export const LargeAndColorful = Template.bind({});
LargeAndColorful.args = {
  description: 'Some label',
  icon: 'mdi:pencil',
  width: '95',
  color: '#FF0000',
};

export const LongDescription = Template.bind({});
LongDescription.args = {
  description: 'Some label',
  longDescription: 'Although this is Some label, there is more to it than meets the eye.',
  icon: 'mdi:pencil',
};

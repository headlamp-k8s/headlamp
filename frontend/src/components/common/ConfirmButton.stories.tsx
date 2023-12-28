import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import ConfirmButton, { ConfirmButtonProps } from './ConfirmButton';

export default {
  title: 'ConfirmButton',
  component: ConfirmButton,
  argTypes: {
    onConfirm: { action: 'confirmed' },
  },
} as Meta;

const Template: StoryFn<ConfirmButtonProps> = args => (
  <ConfirmButton {...args}>Confirm button</ConfirmButton>
);

export const Confirm = Template.bind({});
Confirm.args = {
  ariaLabel: 'confirm undo',
  confirmTitle: 'Are you sure?',
  confirmDescription: 'This will undo. Do you want to proceed?',
};

export const ExtendsButton = Template.bind({});
ExtendsButton.args = {
  color: 'secondary',
  ariaLabel: 'confirm undo',
  confirmTitle: 'Are you sure?',
  confirmDescription: 'This will undo. Do you want to proceed?',
};

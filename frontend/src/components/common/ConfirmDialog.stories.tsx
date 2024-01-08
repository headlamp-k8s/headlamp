import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { ConfirmDialog as ConfirmDialogComponent, ConfirmDialogProps } from './Dialog';

export default {
  title: 'ConfirmDialog',
  component: ConfirmDialogComponent,
  argTypes: {
    onConfirm: { action: 'confirm clicked' },
    handleClose: { action: 'closed' },
  },
} as Meta;

const Template: StoryFn<ConfirmDialogProps> = args => <ConfirmDialogComponent {...args} />;

export const ConfirmDialog = Template.bind({});
ConfirmDialog.args = {
  open: true,
  title: 'A fine title',
  description: 'A really good description.',
};

export const ConfirmDialogClosed = Template.bind({});
ConfirmDialogClosed.args = {
  open: false,
  title: 'A fine title',
  description: 'A really good description.',
};

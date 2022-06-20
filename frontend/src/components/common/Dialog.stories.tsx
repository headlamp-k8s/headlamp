import { DialogContent, Typography } from '@material-ui/core';
import { Meta, Story } from '@storybook/react/types-6-0';
import {
  ConfirmDialog as ConfirmDialogComponent,
  ConfirmDialogProps,
  Dialog as DialogComponent,
  DialogProps,
} from './Dialog';

// NOTE: Dialog.tsx should maybe be renamed ConfirmDialog.tsx

export default {
  title: 'Dialog',
  component: ConfirmDialogComponent,
  argTypes: {
    onConfirm: { action: 'confirm clicked' },
    handleClose: { action: 'closed' },
  },
} as Meta;

const ConfirmTemplate: Story<ConfirmDialogProps> = args => <ConfirmDialogComponent {...args} />;

export const ConfirmDialog = ConfirmTemplate.bind({});
ConfirmDialog.args = {
  open: true,
  title: 'A fine title',
  description: 'A really good description.',
};

export const ConfirmDialogClosed = ConfirmTemplate.bind({});
ConfirmDialogClosed.args = {
  open: false,
  title: 'A fine title',
  description: 'A really good description.',
};

const Template: Story<DialogProps> = args => (
  <DialogComponent {...args}>
    <DialogContent>
      <Typography>Some content here</Typography>
    </DialogContent>
  </DialogComponent>
);

export const Dialog = Template.bind({});
Dialog.args = {
  open: true,
  title: 'A fine title',
};

export const DialogWithCloseButton = Template.bind({});
DialogWithCloseButton.args = {
  open: true,
  title: 'A fine title',
};

export const DialogWithFullScreenButton = Template.bind({});
DialogWithFullScreenButton.args = {
  open: true,
  title: 'A fine title',
  withFullScreen: true,
};

export const DialogAlreadyInFullScreen = Template.bind({});
DialogAlreadyInFullScreen.args = {
  open: true,
  title: 'A fine title',
  withFullScreen: true,
  fullScreen: true,
};

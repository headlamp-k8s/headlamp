import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import ReleaseNotesModal, { ReleaseNotesModalProps } from './ReleaseNotesModal';

export default {
  title: 'common/ReleaseNotes/ReleaseNotesModal',
  component: ReleaseNotesModal,
  argTypes: {},
} as Meta;

const Template: Story<ReleaseNotesModalProps> = args => <ReleaseNotesModal {...args} />;

export const Show = Template.bind({});
Show.args = {
  releaseNotes: '### Hello\n\nworld',
  appVersion: '1.9.9',
};

export const Closed = Template.bind({});
Closed.args = {
  releaseNotes: undefined,
  appVersion: null,
};

export const ShowNoNotes = Template.bind({});
ShowNoNotes.args = {
  releaseNotes: undefined,
  appVersion: '1.8.8',
};

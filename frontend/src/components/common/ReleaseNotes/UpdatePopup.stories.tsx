import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import UpdatePopup, { UpdatePopupProps } from './UpdatePopup';

export default {
  title: 'common/ReleaseNotes/UpdatePopup',
  component: UpdatePopup,
  argTypes: {},
} as Meta;

const Template: Story<UpdatePopupProps> = args => <UpdatePopup {...args} />;

export const Show = Template.bind({});
Show.args = {
  releaseDownloadURL: 'https://example.com',
};

export const Closed = Template.bind({});
Closed.args = {
  releaseDownloadURL: 'https://example.com',
  open: false,
};

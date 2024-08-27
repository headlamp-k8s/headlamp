import '../../../i18n/config';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import ViewButton from './ViewButton';
import { ViewButtonProps } from './ViewButton';

export default {
  title: 'Resource/ViewButton',
  component: ViewButton,
  argTypes: {},
} as Meta;

const Template: StoryFn<ViewButtonProps> = args => <ViewButton {...args} />;

export const View = Template.bind({});
View.args = {
  item: {
    jsonData: {},
  },
};

export const ViewOpen = Template.bind({});
ViewOpen.args = {
  item: {
    jsonData: {},
  },
  initialToggle: true,
};

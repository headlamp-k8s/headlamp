import '../../../i18n/config';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import ViewButton from './ViewButton';
import { ViewButtonProps } from './ViewButton';

export default {
  title: 'Resource/ViewButton',
  component: ViewButton,
  argTypes: {},
} as Meta;

const Template: Story<ViewButtonProps> = args => <ViewButton {...args} />;

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

import '../../../i18n/config';
import { Meta, Story } from '@storybook/react';
import React from 'react';
import { KubeObject } from '../../../lib/k8s/cluster';
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
  } as KubeObject,
};

export const ViewOpen = Template.bind({});
ViewOpen.args = {
  item: {
    jsonData: {},
  } as KubeObject,
  initialToggle: true,
};

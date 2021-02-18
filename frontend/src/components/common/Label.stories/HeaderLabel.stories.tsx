import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { HeaderLabel as HeaderLabelComponent, HeaderLabelProps } from '../Label';

export default {
  title: 'Label/HeaderLabel',
  component: HeaderLabelComponent,
  argTypes: {},
} as Meta;

const Template: Story<HeaderLabelProps> = args => <HeaderLabelComponent {...args} />;

export const HeaderLabel = Template.bind({});
HeaderLabel.args = {
  value: 'value',
  label: 'name',
};
export const HeaderLabelToolTip = Template.bind({});
HeaderLabelToolTip.args = {
  value: 'value',
  label: 'name',
  tooltip: 'tooltip',
};

import { Meta, Story } from '@storybook/react';
import React from 'react';
import LocaleSelect, { LocaleSelectProps } from './LocaleSelect';

export default {
  title: 'LocaleSelect',
  component: LocaleSelect,
  argTypes: {},
} as Meta;

const Template: Story<LocaleSelectProps> = args => <LocaleSelect {...args} />;

export const Initial = Template.bind({});
Initial.args = {};

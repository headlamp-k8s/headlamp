import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import LocaleSelect, { LocaleSelectProps } from './LocaleSelect';

export default {
  title: 'LocaleSelect',
  component: LocaleSelect,
  argTypes: {},
} as Meta;

const Template: StoryFn<LocaleSelectProps> = args => <LocaleSelect {...args} />;

export const Initial = Template.bind({});
Initial.args = {};

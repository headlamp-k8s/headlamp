import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { InfoLabel as InfoLabelComponent, InfoLabelProps } from '../Label';

export default {
  title: 'Label/InfoLabel',
  component: InfoLabelComponent,
  argTypes: {},
} as Meta;

const Template: StoryFn<InfoLabelProps> = args => <InfoLabelComponent {...args} />;

export const InfoLabel = Template.bind({});
InfoLabel.args = {
  name: 'name',
  value: 'value',
};

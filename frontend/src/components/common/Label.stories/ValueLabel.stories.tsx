import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { ValueLabel as ValueLabelComponent } from '../Label';

export default {
  title: 'Label/ValueLabel',
  component: ValueLabelComponent,
  argTypes: {},
} as Meta;

const ValueLabelTemplate: StoryFn<{}> = args => (
  <ValueLabelComponent {...args}>A ValueLabel is here</ValueLabelComponent>
);

export const ValueLabel = ValueLabelTemplate.bind({});

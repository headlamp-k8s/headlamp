import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { ValueLabel as ValueLabelComponent } from '../Label';

export default {
  title: 'Label/ValueLabel',
  component: ValueLabelComponent,
  argTypes: {},
} as Meta;

const ValueLabelTemplate: Story<{}> = args => (
  <ValueLabelComponent {...args}>A ValueLabel is here</ValueLabelComponent>
);

export const ValueLabel = ValueLabelTemplate.bind({});

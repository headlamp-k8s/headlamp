import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { NameLabel as NameLabelComponent } from '../Label';

export default {
  title: 'Label/NameLabel',
  component: NameLabelComponent,
  argTypes: {},
} as Meta;

const Template: StoryFn<{}> = args => (
  <NameLabelComponent {...args}>A name label</NameLabelComponent>
);

export const NameLabel = Template.bind({
  component: NameLabelComponent,
});

import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { NameLabel as NameLabelComponent } from '../Label';

export default {
  title: 'Label/NameLabel',
  component: NameLabelComponent,
  argTypes: {},
} as Meta;

const Template: Story<{}> = args => <NameLabelComponent {...args}>A name label</NameLabelComponent>;

export const NameLabel = Template.bind({
  component: NameLabelComponent,
});

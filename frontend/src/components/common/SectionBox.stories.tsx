import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import SectionBox, { SectionBoxProps } from './SectionBox';

export default {
  title: 'SectionBox',
  component: SectionBox,
  argTypes: { onTabChanged: { action: 'tab changed' } },
} as Meta;

const Template: Story<SectionBoxProps> = args => <SectionBox {...args} />;

export const WithChildren = Template.bind({});
WithChildren.args = {
  children: <p>A child paragraph.</p>,
};

export const Titled = Template.bind({});
Titled.args = {
  title: 'This is a section title default',
};

export const HeaderProps = Template.bind({});
HeaderProps.args = {
  title: 'This is a section title with a main style',
  headerProps: {
    headerStyle: 'main',
  },
};

export const TitledChildren = Template.bind({});
TitledChildren.args = {
  title: 'This is a section title',
  children: <p>A child paragraph.</p>,
};

export const CustomTitle = Template.bind({});
CustomTitle.args = {
  title: <h1>custom title</h1>,
};

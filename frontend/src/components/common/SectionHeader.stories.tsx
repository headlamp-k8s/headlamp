import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import SectionHeader, { SectionHeaderProps } from './SectionHeader';

export default {
  title: 'SectionHeader',
  component: SectionHeader,
  argTypes: { onTabChanged: { action: 'tab changed' } },
} as Meta;

const Template: Story<SectionHeaderProps> = args => <SectionHeader {...args} />;

export const Main = Template.bind({});
Main.args = {
  title: 'This is a section title main',
  headerStyle: 'main',
};

export const Subsection = Template.bind({});
Subsection.args = {
  title: 'This is a section title subsection',
  headerStyle: 'subsection',
};

export const Normal = Template.bind({});
Normal.args = {
  title: 'This is a section title normal',
  headerStyle: 'normal',
};

export const NormalNoPadding = Template.bind({});
NormalNoPadding.args = {
  title: 'No padding on this normal title',
  headerStyle: 'normal',
  noPadding: true,
};

export const Actions = Template.bind({});
Actions.args = {
  title: 'This one has actions',
  headerStyle: 'normal',
  actions: [<button>Edit</button>, <button>Delete</button>],
};

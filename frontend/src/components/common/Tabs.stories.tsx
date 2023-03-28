import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import Tabs, { TabsProps } from './Tabs';

export default {
  title: 'Tabs',
  component: Tabs,
  argTypes: { onTabChanged: { action: 'tab changed' } },
} as Meta;

const Template: Story<TabsProps> = args => <Tabs {...args} />;

export const BasicTabs = Template.bind({});
BasicTabs.args = {
  tabs: [
    {
      label: 'tab 1 label',
      component: <p>tab body 1</p>,
    },
    {
      label: 'tab 2 label',
      component: <p>tab body 2</p>,
    },
  ],
  ariaLabel: 'Basic Tabs',
};

export const StartingTab = Template.bind({});
StartingTab.args = {
  defaultIndex: 1,
  tabs: [
    {
      label: 'tab 1 label',
      component: <p>tab body 1</p>,
    },
    {
      label: 'tab 2 label',
      component: <p>We start on the second tab using defaultIndex=1</p>,
    },
  ],
  ariaLabel: 'Starting Tabs',
};

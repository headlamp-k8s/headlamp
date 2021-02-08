import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { PercentageCircle, PercentageCircleProps } from '../Chart';

export default {
  title: 'Charts/PercentageCircle',
  component: PercentageCircle,
  argTypes: {},
} as Meta;

const Template: Story<PercentageCircleProps> = args => <PercentageCircle {...args} />;

export const Percent100 = Template.bind({});
Percent100.args = {
  data: [
    { name: 'ready', value: 9 },
    { name: 'notReady', value: 0, fill: '#f44336' },
  ],
  total: 9,
  label: '100.0 %',
  title: 'Pods',
  legend: '9 / 9 Requested',
};

export const Percent50 = Template.bind({});
Percent50.args = {
  data: [
    { name: 'ready', value: 5 },
    { name: 'notReady', value: 5, fill: '#f44336' },
  ],
  total: 10,
  label: '50.0 %',
  title: 'Pods',
  legend: '5 / 10 Requested',
};

export const NoData = Template.bind({});
NoData.args = {
  title: 'CPU usage',
  data: [],
  total: -1,
  label: '100.0 %',
  legend: '-1.00 / -1 units',
};

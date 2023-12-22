import { Meta, StoryFn } from '@storybook/react';
import { PercentageBar, PercentageBarProps } from '../Chart';

export default {
  title: 'Charts/PercentageBar',
  component: PercentageBar,
  argTypes: {},
} as Meta;

const Template: StoryFn<PercentageBarProps> = args => <PercentageBar {...args} />;

export const Percent100 = Template.bind({});
Percent100.args = {
  data: [
    { name: 'ready', value: 9 },
    { name: 'notReady', value: 0, fill: '#f44336' },
  ],
  total: 9,
};

export const Percent50 = Template.bind({});
Percent50.args = {
  data: [
    { name: 'ready', value: 5 },
    { name: 'notReady', value: 5, fill: '#f44336' },
  ],
  total: 10,
};

export const NoData = Template.bind({});
NoData.args = {
  data: [],
  total: -1,
};

export const Tooltip = Template.bind({});
Tooltip.args = {
  data: [
    { name: 'ready', value: 5 },
    { name: 'notReady', value: 5, fill: '#f44336' },
  ],
  total: 10,
  tooltipFunc: () => <p>here is the tooltip</p>,
};

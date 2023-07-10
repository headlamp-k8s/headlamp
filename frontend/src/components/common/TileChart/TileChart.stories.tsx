import '../../../i18n/config';
import { Meta, Story } from '@storybook/react/types-6-0';
import TileChart, { TileChartProps } from './TileChart';

export default {
  title: 'Charts/TileChart',
  component: TileChart,
  argTypes: {},
} as Meta;

const Template: Story<TileChartProps> = args => <TileChart {...args} />;

export const WithProgress = Template.bind({});
WithProgress.args = {
  data: [
    {
      name: 'progress',
      value: 10,
    },
    {
      name: 'remaining',
      value: 90,
      fill: '#ff0',
    },
  ],
  total: 100,
  title: 'My chart',
  legend: 'Progress so far',
  label: '10%',
};

export const WithoutProgress = Template.bind({});
WithoutProgress.args = {
  title: 'My chart',
  legend: 'Progress so far',
  infoTooltip: 'This is a tooltip',
};

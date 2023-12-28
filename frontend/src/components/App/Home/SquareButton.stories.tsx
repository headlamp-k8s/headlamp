import { Meta, StoryFn } from '@storybook/react';
import SquareButton, { SquareButtonProps } from './SquareButton';

export default {
  title: 'common/SquareButton',
  component: SquareButton,
  argTypes: {},
} as Meta;

const Template: StoryFn<SquareButtonProps> = args => <SquareButton {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  icon: 'mdi:pencil',
  label: 'Some label',
};

export const DifferentIconSize = Template.bind({});
DifferentIconSize.args = {
  icon: 'mdi:pencil',
  label: 'Some label',
  iconSize: 100,
};

export const DifferentIconColor = Template.bind({});
DifferentIconColor.args = {
  icon: 'mdi:pencil',
  label: 'Some label',
  iconColor: 'red',
};

export const Primary = Template.bind({});
Primary.args = {
  icon: 'mdi:pencil',
  label: 'Some label',
  primary: true,
};

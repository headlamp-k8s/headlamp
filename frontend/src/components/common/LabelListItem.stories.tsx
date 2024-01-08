import { Meta, StoryFn } from '@storybook/react';
import LabelListItem, { LabelListItemProps } from './LabelListItem';

export default {
  title: 'LabelListItem',
  component: LabelListItem,
} as Meta;

const Template: StoryFn<LabelListItemProps> = args => <LabelListItem {...args} />;

export const List = Template.bind({});
List.args = {
  labels: ['a label', 'another label', 'yet another label'],
};

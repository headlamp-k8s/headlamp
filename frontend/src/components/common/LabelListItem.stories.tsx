import { Meta, Story } from '@storybook/react/types-6-0';
import LabelListItem, { LabelListItemProps } from './LabelListItem';

export default {
  title: 'LabelListItem',
  component: LabelListItem,
} as Meta;

const Template: Story<LabelListItemProps> = args => <LabelListItem {...args} />;

export const List = Template.bind({});
List.args = {
  labels: ['a label', 'another label', 'yet another label'],
};

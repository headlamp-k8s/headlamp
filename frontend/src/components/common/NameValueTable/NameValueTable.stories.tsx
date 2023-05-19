import { Meta, Story } from '@storybook/react/types-6-0';
import NameValueTable, { NameValueTableProps } from './NameValueTable';

export default {
  title: 'NameValueTable',
  component: NameValueTable,
  argTypes: { onTabChanged: { action: 'tab changed' } },
} as Meta;

const Template: Story<NameValueTableProps> = args => <NameValueTable {...args} />;

export const WithChildren = Template.bind({});
WithChildren.args = {
  rows: [
    {
      name: 'MyName0',
      value: 'MyValue0',
    },
    {
      name: 'MyName1',
      value: 'MyValue1',
    },
    {
      name: 'MyName2',
      value: 'MyValue2',
    },
  ],
};

export const Empty = Template.bind({});
Empty.args = {
  rows: [],
};

// Hidden name/values that were the last children were causing the table to have a bottom border.
export const WithHiddenLastChildren = Template.bind({});
WithHiddenLastChildren.args = {
  rows: [
    {
      name: 'MyName0',
      value: 'MyValue0',
    },
    {
      name: 'MyName1',
      value: 'MyValue1',
    },
    {
      name: 'MyName2',
      value: 'MyValue2',
      hide: value => !!value,
    },
    {
      name: 'MyName2',
      value: 'MyValue2',
      hide: true,
    },
  ],
};

import { Meta, Story } from '@storybook/react';
import store from '../../redux/stores/store';
import { TestContext } from '../../test';
import VirtualizedTable, { VirtualizedTableProps } from './VirtualizedTable';

export default {
  title: 'VirtualizedTable',
  component: VirtualizedTable,
  argTypes: {},
} as Meta;

function TestVirtualizedTable(props: VirtualizedTableProps) {
  return <VirtualizedTable {...props} />;
}

const Template: Story<VirtualizedTableProps> = args => (
  <TestContext store={store}>
    <TestVirtualizedTable {...args} />
  </TestContext>
);

export const Default = Template.bind({});
Default.args = {
  cellRenderer: () => {},
  headerRenderer: () => {},
  rowCount: 0,
  columns: [],
  rowGetter: () => {},
};

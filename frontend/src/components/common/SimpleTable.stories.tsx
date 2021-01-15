import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import SimpleTable from './SimpleTable';
import { SimpleTableProps } from './SimpleTable';

export default {
  title: 'SimpleTable',
  component: SimpleTable,
  argTypes: {},
} as Meta;

const Template: Story<SimpleTableProps> = (args) => <SimpleTable {...args} />;

const fixtureData = {
  rowsPerPage: [15, 25, 50],
  errorMessage: null,
  columns: [
    {
      label: 'Name',
      datum: 'name',
    },
    {
      label: 'Status',
      datum: 'status',
    },
    {
      label: 'Age',
      datum: 'age',
    },
  ],
  data: [
    {
      name: 'some name0',
      status: 'some status0',
      age: 'some age0',
    },
    {
      name: 'some name1',
      status: 'some status1',
      age: 'some age1',
    },
    {
      name: 'some name2',
      status: 'some status2',
      age: 'some age2',
    },
  ],
  defaultSortingColumn: 1,
};

export const Getter = Template.bind({});
Getter.args = {
  ...fixtureData,
  columns: [
    {
      label: 'Name',
      // datum: "",
      getter: (row: any) => row.name,
    },
    {
      label: 'Status',
      // datum: "",
      getter: (row: any) => row.status,
    },
    {
      label: 'Age',
      // datum: "",
      getter: (row: any) => row.age,
    },
  ],
};

export const Datum = Template.bind({});
Datum.args = {
  ...fixtureData,
  columns: [
    {
      label: 'Name',
      datum: 'name',
    },
    {
      label: 'Status',
      datum: 'status',
    },
    {
      label: 'Age',
      datum: 'age',
    },
  ],
};

// filterFunction
// emptyMessage
// defaultSortingColumn
// rowsPerPage
// errorMessage

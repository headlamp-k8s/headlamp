import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/stores/store';
import SimpleTable from './SimpleTable';
import { SimpleTableProps } from './SimpleTable';

export default {
  title: 'SimpleTable',
  component: SimpleTable,
  argTypes: {},
} as Meta;

const Template: Story<SimpleTableProps> = args => (
  <Provider store={store}>
    <SimpleTable {...args} />
  </Provider>
);

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
    {
      label: 'Long Field Name',
      datum: 'longField',
    },
    {
      label: 'Number',
      datum: 'number',
    },
  ],
  data: [
    {
      name: 'some name0',
      status: 'some status0',
      age: 'some age0',
      longField:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      number: '22',
    },
    {
      name: 'some name1',
      status: 'some status1',
      age: 'some age1',
      longField:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      number: '33',
    },
    {
      name: 'some name2',
      status: 'some status2',
      age: 'some age2',
      longField:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      number: '44',
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
    {
      label: 'Long Field Name',
      // datum: "",
      getter: (row: any) => row.longField,
    },
    {
      label: 'Number',
      // datum: "",
      getter: (row: any) => row.number,
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
    {
      label: 'Long Field Name',
      datum: 'longField',
    },
  ],
};

// filterFunction
// emptyMessage
// defaultSortingColumn
// rowsPerPage
// errorMessage

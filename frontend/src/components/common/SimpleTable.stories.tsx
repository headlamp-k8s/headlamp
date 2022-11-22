import { Box, Typography } from '@material-ui/core';
import { Meta, Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import { MemoryRouter, useLocation } from 'react-router-dom';
import { createStore } from 'redux';
import { KubeObjectInterface } from '../../lib/k8s/cluster';
import { useFilterFunc } from '../../lib/util';
import store from '../../redux/stores/store';
import { TestContext, TestContextProps } from '../../test';
import SectionFilterHeader from './SectionFilterHeader';
import SimpleTable, { SimpleTableProps } from './SimpleTable';

export default {
  title: 'SimpleTable',
  component: SimpleTable,
  argTypes: {},
} as Meta;

function TestSimpleTable(props: SimpleTableProps) {
  const location = useLocation();
  if (!!props.reflectInURL) {
    return (
      <Box>
        <Typography>Test changing the page and rows per page.</Typography>
        <Typography>
          <b>Current URL search:</b> {`${location.search || ''}`}
        </Typography>
        <SimpleTable {...props} />
      </Box>
    );
  }

  return <SimpleTable {...props} />;
}

const Template: Story<SimpleTableProps> = args => (
  <MemoryRouter>
    <Provider store={store}>
      <TestSimpleTable {...args} />
    </Provider>
  </MemoryRouter>
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

const TemplateWithURLReflection: Story<{
  simpleTableProps: SimpleTableProps;
  testContextProps: TestContextProps;
}> = args => {
  const { testContextProps, simpleTableProps } = args;
  return (
    <TestContext {...testContextProps}>
      <TestSimpleTable {...simpleTableProps} />
    </TestContext>
  );
};

export const ReflectInURL = TemplateWithURLReflection.bind({});
const lotsOfData = (() => {
  const data = [];
  for (let i = 0; i < 50; i++) {
    data.push({
      name: `Name ${i}`,
      namespace: `Namespace ${i}`,
      number: i,
    });
  }
  return data;
})();
ReflectInURL.args = {
  simpleTableProps: {
    data: lotsOfData,
    columns: [
      {
        label: 'Name',
        datum: 'name',
      },
      {
        label: 'Namespace',
        datum: 'namespace',
      },
      {
        label: 'Number',
        datum: 'number',
      },
    ],
    rowsPerPage: [5, 10, 15],
    reflectInURL: true,
    showPagination: !process.env.UNDER_TEST, // Disable for snapshots: The pagination uses useId so snapshots will fail.
  },
  testContextProps: {
    urlSearchParams: { p: '2' }, // 2nd page
  },
};

export const ReflectInURLWithPrefix = TemplateWithURLReflection.bind({});
ReflectInURLWithPrefix.args = {
  simpleTableProps: {
    data: lotsOfData,
    columns: [
      {
        label: 'Name',
        datum: 'name',
      },
      {
        label: 'Namespace',
        datum: 'namespace',
      },
      {
        label: 'Number',
        datum: 'creationDate',
      },
    ],
    rowsPerPage: [5, 10, 15],
    reflectInURL: 'mySuperTable',
    showPagination: !process.env.UNDER_TEST, // Disable for snapshots: The pagination uses useId so snapshots will fail.
  },
  testContextProps: {
    urlSearchParams: { p: '2' }, // 2nd page
  },
};

// filter Function

type SimpleTableWithFilterProps = SimpleTableProps & { matchCriteria?: string[] };
function SimpleTableWithFilter(props: SimpleTableWithFilterProps) {
  const { matchCriteria, ...otherProps } = props;
  const filterFunc = useFilterFunc(matchCriteria);
  return <SimpleTable filterFunction={filterFunc} {...otherProps} />;
}

const TemplateWithFilter: Story<{
  simpleTableArgs: SimpleTableWithFilterProps;
  namespaces: string[];
  search: string;
}> = args => {
  const { simpleTableArgs, search, namespaces = [] } = args;

  const storeWithFilter = createStore(
    (state = { filter: { namespaces: new Set<string>(), search: '' } }) => state,
    {
      filter: {
        namespaces: new Set(namespaces),
        search,
      },
    }
  );

  return (
    <MemoryRouter>
      <Provider store={storeWithFilter}>
        <SectionFilterHeader title="Test" />
        <SimpleTableWithFilter {...simpleTableArgs} />
      </Provider>
    </MemoryRouter>
  );
};

const podData = {
  rowsPerPage: [15, 25, 50],
  errorMessage: null,
  columns: [
    {
      label: 'Name',
      getter: (item: KubeObjectInterface) => item.metadata.name,
    },
    {
      label: 'Namespace',
      getter: (item: KubeObjectInterface) => item.metadata.namespace,
    },
    {
      label: 'UID',
      getter: (item: KubeObjectInterface) => item.metadata.uid,
    },
    {
      label: 'Labels',
      getter: (item: KubeObjectInterface) => JSON.stringify(item.metadata.labels),
    },
  ],
  data: [
    {
      kind: 'CustomResourceDefinition',
      apiVersion: 'apiextensions.k8s.io',
      metadata: {
        name: 'mydefinition.phonyresources0.io',
        uid: 'phony0',
        creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
        resourceVersion: '1',
        selfLink: '0',
        namespace: 'MyNamespace0',
      },
      someNumber: 0,
    },
    {
      kind: 'CustomResourceDefinition',
      apiVersion: 'apiextensions.k8s.io',
      metadata: {
        name: 'mydefinition.phonyresources1.io',
        uid: 'phony1',
        creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
        resourceVersion: '1',
        selfLink: '1',
        namespace: 'MyNamespace1',
        labels: {
          mylabel1: 'myvalue1',
        },
      },
      someNumber: 10,
    },
    {
      kind: 'CustomResourceDefinition',
      apiVersion: 'apiextensions.k8s.io',
      metadata: {
        name: 'mydefinition.phonyresources2.io',
        uid: 'phony2',
        creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
        resourceVersion: '1',
        selfLink: '2',
        namespace: 'MyNamespace2',
        labels: {
          mykey2: 'mylabel',
        },
      },
      someNumber: 20,
    },
    {
      kind: 'CustomResourceDefinition',
      apiVersion: 'apiextensions.k8s.io',
      metadata: {
        name: 'mydefinition.phonyresources3.io',
        uid: 'phony3',
        creationTimestamp: new Date('2021-12-15T14:57:13Z').toString(),
        resourceVersion: '1',
        selfLink: '3',
        namespace: 'MyNamespace3',
        labels: {
          mykey3: 'myvalue3',
        },
      },
      someNumber: 30,
    },
  ],
  defaultSortingColumn: 1,
};

export const NameSearch = TemplateWithFilter.bind({});
NameSearch.args = {
  simpleTableArgs: podData,
  search: 'phonyresources2',
};

export const NamespaceSearch = TemplateWithFilter.bind({});
NamespaceSearch.args = {
  simpleTableArgs: podData,
  search: 'MyNamespace3',
};

export const UIDSearch = TemplateWithFilter.bind({});
UIDSearch.args = {
  simpleTableArgs: podData,
  search: 'phony0',
};

export const LabelSearch = TemplateWithFilter.bind({});
LabelSearch.args = {
  simpleTableArgs: podData,
  search: 'mylabel',
};

export const NamespaceSelect = TemplateWithFilter.bind({});
NamespaceSelect.args = {
  simpleTableArgs: podData,
  namespaces: ['MyNamespace0', 'MyNamespace1'],
};

export const NumberSearch = TemplateWithFilter.bind({});
NumberSearch.args = {
  simpleTableArgs: {
    ...podData,
    matchCriteria: ['.someNumber'],
    columns: [
      {
        label: 'Name',
        getter: (item: KubeObjectInterface) => item.metadata.name,
      },
      {
        label: 'Namespace',
        getter: (item: KubeObjectInterface) => item.metadata.namespace,
      },
      {
        label: 'Number',
        datum: 'someNumber',
      },
    ],
  },
  search: '30',
};

// emptyMessage
// defaultSortingColumn
// rowsPerPage
// errorMessage

import { Meta, Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { KubeObject } from '../../../lib/k8s/cluster';
import Pod, { KubePod } from '../../../lib/k8s/pod';
import ResourceTable, { ResourceTableFromResourceClassProps } from './ResourceTable';

export default {
  title: 'ResourceTable',
  component: ResourceTable,
  argTypes: {},
} as Meta;

const TemplateWithFilter: Story<{
  resourceTableArgs: ResourceTableFromResourceClassProps;
  namespaces: string[];
  search: string;
}> = args => {
  const { resourceTableArgs, search, namespaces = [] } = args;

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
        <ResourceTable {...resourceTableArgs} />
      </Provider>
    </MemoryRouter>
  );
};

class MyPod extends Pod {
  static useList = () =>
    [
      [
        {
          kind: 'Pod',
          apiVersion: 'v1',
          metadata: {
            name: 'mypod0',
            uid: 'phony0',
            creationTimestamp: '2021-12-15T14:57:13Z',
            resourceVersion: '1',
            selfLink: '0',
            namespace: 'MyNamespace0',
          },
        },
        {
          kind: 'Pod',
          apiVersion: 'v1',
          metadata: {
            name: 'mypod1',
            uid: 'phony1',
            creationTimestamp: '2021-12-15T14:57:13Z',
            resourceVersion: '1',
            selfLink: '1',
            namespace: 'MyNamespace1',
            labels: {
              mylabel1: 'myvalue1',
            },
          },
        },
        {
          kind: 'Pod',
          apiVersion: 'v1',
          metadata: {
            name: 'mypod2',
            uid: 'phony2',
            creationTimestamp: '2021-12-15T14:57:13Z',
            resourceVersion: '1',
            selfLink: '2',
            namespace: 'MyNamespace2',
            labels: {
              mykey2: 'mylabel',
            },
          },
        },
        {
          kind: 'Pod',
          apiVersion: 'v1',
          metadata: {
            name: 'mypod3',
            uid: 'phony3',
            creationTimestamp: '2021-12-15T14:57:13Z',
            resourceVersion: '1',
            selfLink: '3',
            namespace: 'MyNamespace3',
            labels: {
              mykey3: 'myvalue3',
            },
          },
        },
      ].map(pod => new Pod(pod as KubePod)),
      null,
      () => {},
      () => {},
    ] as any;
}

const podData: ResourceTableFromResourceClassProps = {
  columns: ['name', 'namespace', 'age'],
  resourceClass: MyPod as KubeObject,
};

export const NoFilter = TemplateWithFilter.bind({});
NoFilter.args = {
  resourceTableArgs: podData,
  search: '',
};

export const NameSearch = TemplateWithFilter.bind({});
NameSearch.args = {
  resourceTableArgs: podData,
  search: 'mypod3',
};

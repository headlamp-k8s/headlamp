import { Meta, Story } from '@storybook/react';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import CustomResourceDefinition from '../../lib/k8s/crd';
import { overrideKubeObject, TestContext, TestContextProps } from '../../test';
import CustomResourceDefinitionDetails from './Details';
import CustomResourceDefinitionList from './List';
import { CRDMockMethods } from './storyHelper';

interface MockerStory {
  viewType: 'list' | 'details';
  name?: string;
  namespace?: string;
  useListQuery?: KubeObjectClass['useListQuery'];
  useApiGet?: KubeObjectClass['useApiGet'];
}

export default {
  title: 'crd/CustomResourceDefinition',
  argTypes: {},
  decorators: [Story => <Story />],
} as Meta;

const Template: Story<MockerStory> = args => {
  const { useListQuery, useApiGet, name, namespace, viewType = 'list' } = args;
  const routerMap: TestContextProps['routerMap'] = {};

  overrideKubeObject(CustomResourceDefinition, {
    useApiGet,
    useListQuery,
  });

  if (!!name) {
    routerMap['name'] = name;
  }
  if (!!namespace) {
    routerMap['namespace'] = namespace;
  }

  return (
    <TestContext routerMap={routerMap}>
      {viewType === 'list' ? <CustomResourceDefinitionList /> : <CustomResourceDefinitionDetails />}
    </TestContext>
  );
};

export const List = Template.bind({});
List.args = {
  useListQuery: CRDMockMethods.usePhonyListQuery,
};

export const Details = Template.bind({});
Details.args = {
  useApiGet: CRDMockMethods.usePhonyApiGet,
  viewType: 'details',
  name: 'mydefinition.phonyresources.io',
};

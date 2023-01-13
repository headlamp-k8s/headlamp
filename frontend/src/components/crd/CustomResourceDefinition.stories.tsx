import { Meta, Story } from '@storybook/react/types-6-0';
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
  useGet?: KubeObjectClass['useGet'];
  useList?: KubeObjectClass['useList'];
  useApiGet?: KubeObjectClass['useApiGet'];
  useApiList?: KubeObjectClass['useApiList'];
}

export default {
  title: 'crd/CustomResourceDefinition',
  argTypes: {},
  decorators: [Story => <Story />],
} as Meta;

const Template: Story<MockerStory> = args => {
  const { useGet, useList, useApiGet, useApiList, name, namespace, viewType = 'list' } = args;
  const routerMap: TestContextProps['routerMap'] = {};

  overrideKubeObject(CustomResourceDefinition, {
    useApiGet,
    useApiList,
    useGet,
    useList,
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
  useList: CRDMockMethods.usePhonyList,
};

export const Details = Template.bind({});
Details.args = {
  useApiGet: CRDMockMethods.usePhonyApiGet,
  viewType: 'details',
  name: 'mydefinition.phonyresources.io',
};

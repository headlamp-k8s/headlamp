import { Meta, Story } from '@storybook/react';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import CustomResourceDefinition from '../../lib/k8s/crd';
import { overrideKubeObject, TestContext, TestContextProps } from '../../test';
import CustomResourceList from './CustomResourceList';
import { CRDMockMethods } from './storyHelper';

interface MockerStory {
  useApiGet?: KubeObjectClass['useApiGet'];
  useQuery?: KubeObjectClass['useQuery'];
  routerParams?: TestContextProps['routerMap'];
}

export default {
  title: 'crd/CustomResourceList',
  argTypes: {},
  decorators: [Story => <Story />],
} as Meta;

const Template: Story<MockerStory> = args => {
  const { useApiGet, useQuery, routerParams = {} } = args;
  const routerMap: TestContextProps['routerMap'] = routerParams;

  overrideKubeObject(CustomResourceDefinition, {
    useApiGet,
    useQuery,
    useQueryList: CRDMockMethods.usePhonyListQuery,
  });

  return (
    <TestContext routerMap={routerMap}>
      <CustomResourceList />
    </TestContext>
  );
};

export const List = Template.bind({});
List.args = {
  useApiGet: CRDMockMethods.usePhonyApiGet,
  useQuery: CRDMockMethods.usePhonyQuery,
  routerParams: {
    crd: 'mydefinition.phonyresources.io',
  },
};

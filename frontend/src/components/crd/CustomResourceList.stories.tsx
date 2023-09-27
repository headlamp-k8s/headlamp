import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObjectClass } from '../../lib/k8s/cluster';
import CustomResourceDefinition from '../../lib/k8s/crd';
import { overrideKubeObject, TestContext, TestContextProps } from '../../test';
import CustomResourceList from './CustomResourceList';
import { CRDMockMethods } from './storyHelper';

interface MockerStory {
  useApiGet?: KubeObjectClass['useApiGet'];
  routerParams?: TestContextProps['routerMap'];
}

export default {
  title: 'crd/CustomResourceList',
  argTypes: {},
  decorators: [Story => <Story />],
} as Meta;

const Template: Story<MockerStory> = args => {
  const { useApiGet, routerParams = {} } = args;
  const routerMap: TestContextProps['routerMap'] = routerParams;

  overrideKubeObject(CustomResourceDefinition, {
    useApiGet,
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
  routerParams: {
    crd: 'mydefinition.phonyresources.io',
  },
};

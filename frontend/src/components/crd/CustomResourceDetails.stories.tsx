import { Meta, Story } from '@storybook/react/types-6-0';
import { ResourceClasses } from '../../lib/k8s';
import CustomResourceDefinition from '../../lib/k8s/crd';
import { overrideKubeObject, TestContext } from '../../test';
import { CustomResourceDetails, CustomResourceDetailsProps } from './CustomResourceDetails';
import { CRDMockMethods, CRMockClass } from './storyHelper';

// So we can test with a mocked CR.
ResourceClasses['mycustomresources'] = CRMockClass;

export default {
  title: 'crd/CustomResourceDetails',
  component: CustomResourceDetails,
  argTypes: {},
  decorators: [
    Story => {
      overrideKubeObject(CustomResourceDefinition, {
        useApiGet: CRDMockMethods.usePhonyApiGet,
      });

      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: Story<CustomResourceDetailsProps> = args => <CustomResourceDetails {...args} />;

export const NoError = Template.bind({});
NoError.args = {
  crName: 'mycustomresource',
  crd: 'mydefinition.phonyresources.io',
  namespace: 'mynamespace',
};

export const LoadingCRD = Template.bind({});
LoadingCRD.args = {
  crName: 'loadingcr',
  crd: 'loadingcrd',
  namespace: '-',
};

export const ErrorGettingCRD = Template.bind({});
ErrorGettingCRD.args = {
  crName: 'doesnotmatter',
  crd: 'error.crd.io',
  namespace: '-',
};

export const ErrorGettingCR = Template.bind({});
ErrorGettingCR.args = {
  crName: 'nonexistentcustomresource',
  crd: 'mydefinition.phonyresources.io',
  namespace: '-',
};

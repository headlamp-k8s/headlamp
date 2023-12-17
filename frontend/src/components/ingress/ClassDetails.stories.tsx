import { Meta, Story } from '@storybook/react/types-6-0';
import IngressClass, { KubeIngressClass } from '../../lib/k8s/ingressClass';
import { TestContext } from '../../test';
import Details from './ClassDetails';
import { RESOURCE_DEFAULT_INGRESS_CLASS, RESOURCE_INGRESS_CLASS } from './storyHelper';

export default {
  title: 'IngressClass/DetailsView',
  component: Details,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

interface MockerStory {
  ingressJson?: KubeIngressClass;
}

const Template: Story = (args: MockerStory) => {
  const { ingressJson } = args;
  if (!!ingressJson) {
    IngressClass.useGet = () => [new IngressClass(ingressJson), null, () => {}, () => {}] as any;
  }
  return <Details />;
};

export const Basic = Template.bind({});
Basic.args = {
  ingressJson: RESOURCE_INGRESS_CLASS,
};

export const WithDefault = Template.bind({});
WithDefault.args = {
  ingressJson: RESOURCE_DEFAULT_INGRESS_CLASS,
};

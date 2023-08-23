import { Meta, Story } from '@storybook/react/types-6-0';
import Ingress, { KubeIngress } from '../../lib/k8s/ingress';
import { TestContext } from '../../test';
import Details from './Details';
import { PORT_INGRESS, RESOURCE_INGRESS } from './storyHelper';

export default {
  title: 'Ingress/DetailsView',
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
  ingressJson?: KubeIngress;
}

const Template: Story = (args: MockerStory) => {
  const { ingressJson } = args;
  if (!!ingressJson) {
    Ingress.useGet = () => [new Ingress(ingressJson), null, () => {}, () => {}] as any;
  }
  return <Details />;
};

export const WithTLS = Template.bind({});
WithTLS.args = {
  ingressJson: PORT_INGRESS,
};

export const WithResource = Template.bind({});
WithResource.args = {
  ingressJson: RESOURCE_INGRESS,
};

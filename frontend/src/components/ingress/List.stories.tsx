import { Meta, Story } from '@storybook/react/types-6-0';
import { KubeObject } from '../../lib/k8s/cluster';
import Ingress from '../../lib/k8s/ingress';
import { TestContext } from '../../test';
import ListView from './List';
import { PORT_INGRESS, RESOURCE_INGRESS } from './storyHelper';

Ingress.useList = () => {
  const objList = [PORT_INGRESS, RESOURCE_INGRESS].map((data: KubeObject) => new Ingress(data));

  return [objList, null, () => {}, () => {}] as any;
};

export default {
  title: 'Ingress/ListView',
  component: ListView,
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

const Template: Story = () => {
  return <ListView />;
};

export const Items = Template.bind({});

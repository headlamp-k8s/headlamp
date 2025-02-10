import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../test';
import { NetworkPolicyDetails } from './Details';

export default {
  title: 'NetworkPolicy/DetailsView',
  component: NetworkPolicyDetails,
  argTypes: {},
  decorators: [
    Story => (
      <TestContext>
        <Story />
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<typeof NetworkPolicyDetails> = args => {
  return <NetworkPolicyDetails {...args} />;
};

export const Default = Template.bind({});
Default.args = {
  name: 'test-name',
  namespace: 'test-namespace',
};

export const NoName = Template.bind({});
NoName.args = {
  name: undefined,
  namespace: 'test-namespace',
};

export const NoNamespace = Template.bind({});
NoNamespace.args = {
  name: 'test-name',
  namespace: undefined,
};

export const NoProps = Template.bind({});
NoProps.args = {
  name: undefined,
  namespace: undefined,
};

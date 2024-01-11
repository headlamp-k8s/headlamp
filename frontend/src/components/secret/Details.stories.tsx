import { Meta, StoryFn } from '@storybook/react';
import Secret, { KubeSecret } from '../../lib/k8s/secret';
import { TestContext } from '../../test';
import SecretDetails from './Details';
import { BASE_EMPTY_SECRET, BASE_SECRET } from './storyHelper';

export default {
  title: 'Secret/DetailsView',
  component: SecretDetails,
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
  json?: KubeSecret;
}

const Template: StoryFn = (args: MockerStory) => {
  const { json } = args;
  if (!!json) {
    Secret.useGet = () => [new Secret(json), null, () => {}, () => {}] as any;
  }
  return <SecretDetails />;
};

export const WithBase = Template.bind({});
WithBase.args = {
  json: BASE_SECRET,
};

export const Empty = Template.bind({});
Empty.args = {
  json: BASE_EMPTY_SECRET,
};

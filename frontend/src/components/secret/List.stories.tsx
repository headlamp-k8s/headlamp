import { Meta, StoryFn } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import Secret from '../../lib/k8s/secret';
import { TestContext } from '../../test';
import ListView from './List';
import { BASE_EMPTY_SECRET, BASE_SECRET } from './storyHelper';

Secret.useListQuery = useMockListQuery.data(
  [BASE_EMPTY_SECRET, BASE_SECRET].map((data: KubeObject) => new Secret(data))
);

export default {
  title: 'Secret/ListView',
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

const Template: StoryFn = () => {
  return <ListView />;
};

export const Items = Template.bind({});

import { Meta, StoryFn } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import ConfigMap from '../../lib/k8s/configMap';
import { TestContext } from '../../test';
import ListView from './List';
import { BASE_CONFIG_MAP, BASE_EMPTY_CONFIG_MAP } from './storyHelper';

ConfigMap.useListQuery = useMockListQuery.data(
  [BASE_CONFIG_MAP, BASE_EMPTY_CONFIG_MAP].map((data: KubeObject) => new ConfigMap(data))
);

export default {
  title: 'ConfigMap/ListView',
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

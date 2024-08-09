import { Meta, StoryFn } from '@storybook/react';
import { useMockQuery } from '../../helpers/testHelpers';
import ConfigMap, { KubeConfigMap } from '../../lib/k8s/configMap';
import { TestContext } from '../../test';
import Details from './Details';
import { BASE_CONFIG_MAP, BASE_EMPTY_CONFIG_MAP } from './storyHelper';

export default {
  title: 'ConfigMap/DetailsView',
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
  json?: KubeConfigMap;
}

const Template: StoryFn = (args: MockerStory) => {
  const { json } = args;
  if (!!json) {
    ConfigMap.useQuery = useMockQuery.data(new ConfigMap(json));
  }
  return <Details />;
};

export const WithBase = Template.bind({});
WithBase.args = {
  json: BASE_CONFIG_MAP,
};

export const Empty = Template.bind({});
Empty.args = {
  json: BASE_EMPTY_CONFIG_MAP,
};

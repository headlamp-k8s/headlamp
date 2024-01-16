import { Meta, StoryFn } from '@storybook/react';
import { KubeRuntimeClass, RuntimeClass } from '../../lib/k8s/runtime';
import { TestContext } from '../../test';
import { RuntimeClassDetails as Details } from './Details';
import { BASE_RC } from './storyHelper';

export default {
  title: 'RuntimeClass/DetailsView',
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
  json?: KubeRuntimeClass;
}

const Template: StoryFn = (args: MockerStory) => {
  const { json } = args;
  if (!!json) {
    RuntimeClass.useGet = () => [new RuntimeClass(json), null, () => {}, () => {}] as any;
  }
  return <Details />;
};

export const Base = Template.bind({});
Base.args = {
  json: BASE_RC,
};

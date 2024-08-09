import { Meta, StoryFn } from '@storybook/react';
import { useMockListQuery } from '../../helpers/testHelpers';
import { KubeObject } from '../../lib/k8s/cluster';
import { RuntimeClass } from '../../lib/k8s/runtime';
import { TestContext } from '../../test';
import { RuntimeClassList } from './List';
import { RUNTIME_CLASS_DUMMY_DATA } from './storyHelper';

RuntimeClass.useListQuery = useMockListQuery.data(
  RUNTIME_CLASS_DUMMY_DATA.map((data: KubeObject) => new RuntimeClass(data))
);

export default {
  title: 'RuntimeClass/ListView',
  component: RuntimeClassList,
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
  return <RuntimeClassList />;
};

export const Items = Template.bind({});

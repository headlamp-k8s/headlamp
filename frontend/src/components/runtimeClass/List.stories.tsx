import { Meta, StoryFn } from '@storybook/react';
import { RuntimeClass } from '../../lib/k8s/runtime';
import { TestContext } from '../../test';
import { RuntimeClassList } from './List';
import { RUNTIME_CLASS_DUMMY_DATA } from './storyHelper';

RuntimeClass.useList = () => {
  const objList = RUNTIME_CLASS_DUMMY_DATA.map(data => new RuntimeClass(data));

  return [objList, null, () => {}, () => {}] as any;
};

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

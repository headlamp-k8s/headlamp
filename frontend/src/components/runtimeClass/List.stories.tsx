import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { RuntimeClassList } from './List';
import { RUNTIME_CLASS_DUMMY_DATA } from './storyHelper';

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
Items.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/apis/node.k8s.io/v1/runtimeclasses', () =>
          HttpResponse.json({
            kind: 'RuntimeClassList',
            items: RUNTIME_CLASS_DUMMY_DATA,
            metadata: {},
          })
        ),
      ],
    },
  },
};

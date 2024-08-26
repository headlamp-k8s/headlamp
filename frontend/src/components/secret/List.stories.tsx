import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './List';
import { BASE_EMPTY_SECRET, BASE_SECRET } from './storyHelper';

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
Items.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/secrets', () =>
          HttpResponse.json({
            kind: 'SecretList',
            items: [BASE_EMPTY_SECRET, BASE_SECRET],
            metadata: {},
          })
        ),
      ],
    },
  },
};

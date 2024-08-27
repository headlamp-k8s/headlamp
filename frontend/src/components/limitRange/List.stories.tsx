import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { LimitRangeList } from './List';
import { LIMIT_RANGE_DUMMY_DATA } from './storyHelper';

export default {
  title: 'LimitRange/ListView',
  component: LimitRangeList,
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
  parameters: {
    msw: {
      handlers: {
        story: [
          http.get('http://localhost:4466/api/v1/limitranges', () =>
            HttpResponse.json({
              kind: 'LimitRangeList',
              metadata: {},
              items: LIMIT_RANGE_DUMMY_DATA,
            })
          ),
        ],
      },
    },
  },
} as Meta;

const Template: StoryFn = () => {
  return <LimitRangeList />;
};

export const Items = Template.bind({});

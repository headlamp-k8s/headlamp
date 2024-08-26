import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import { LimitRangeDetails } from './Details';
import { LIMIT_RANGE_DUMMY_DATA } from './storyHelper';

export default {
  title: 'LimitRange/DetailsView',
  component: LimitRangeDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'my-lr' }}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: StoryFn = () => {
  return <LimitRangeDetails />;
};

export const LimitRangeDetail = Template.bind({});
LimitRangeDetail.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/limitranges/my-lr', () =>
          HttpResponse.json(LIMIT_RANGE_DUMMY_DATA[0])
        ),
        http.get('http://localhost:4466/api/v1/limitranges', () => HttpResponse.error()),
        http.get('http://localhost:4466/api/v1/namespaces/default/events', () =>
          HttpResponse.json({
            kind: 'EventList',
            items: [],
            metadata: {},
          })
        ),
      ],
    },
  },
};

import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import SecretDetails from './Details';
import { BASE_EMPTY_SECRET, BASE_SECRET } from './storyHelper';

export default {
  title: 'Secret/DetailsView',
  component: SecretDetails,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'my-secret' }}>
          <Story />
        </TestContext>
      );
    },
  ],
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get('http://localhost:4466/api/v1/secrets', () => HttpResponse.error()),
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
  },
} as Meta;

const Template: StoryFn = () => {
  return <SecretDetails />;
};

export const WithBase = Template.bind({});
WithBase.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/secrets/my-secret', () =>
          HttpResponse.json(BASE_SECRET)
        ),
      ],
    },
  },
};

export const Empty = Template.bind({});
Empty.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/secrets/my-secret', () =>
          HttpResponse.json(BASE_EMPTY_SECRET)
        ),
      ],
    },
  },
};

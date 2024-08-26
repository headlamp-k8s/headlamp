import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
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
        <TestContext routerMap={{ name: 'my-cm' }}>
          <Story />
        </TestContext>
      );
    },
  ],
  parameters: {
    msw: {
      handlers: {
        storyBase: [
          http.get('http://localhost:4466/api/v1/configmaps', () => HttpResponse.error()),
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
  return <Details />;
};

export const WithBase = Template.bind({});
WithBase.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/configmaps/my-cm', () =>
          HttpResponse.json(BASE_CONFIG_MAP)
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
        http.get('http://localhost:4466/api/v1/configmaps/my-cm', () =>
          HttpResponse.json(BASE_EMPTY_CONFIG_MAP)
        ),
      ],
    },
  },
};

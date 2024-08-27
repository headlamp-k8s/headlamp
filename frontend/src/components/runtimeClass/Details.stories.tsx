import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
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
        <TestContext routerMap={{ name: 'my-rc' }}>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: StoryFn = () => {
  return <Details />;
};

export const Base = Template.bind({});
Base.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/apis/node.k8s.io/v1/runtimeclasses/my-rc', () =>
          HttpResponse.json(BASE_RC)
        ),
        http.get('http://localhost:4466/apis/node.k8s.io/v1/runtimeclasses', () =>
          HttpResponse.error()
        ),
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

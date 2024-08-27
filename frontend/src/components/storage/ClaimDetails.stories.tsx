import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import Details from './ClaimDetails';
import { BASE_PVC } from './storyHelper';

export default {
  title: 'PersistentVolumeClaim/DetailsView',
  component: Details,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'my-pvc' }}>
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
Base.args = {
  json: BASE_PVC,
};
Base.parameters = {
  msw: {
    handlers: {
      story: [
        http.get('http://localhost:4466/api/v1/persistentvolumeclaims/my-pvc', () =>
          HttpResponse.json(BASE_PVC)
        ),
        http.get('http://localhost:4466/api/v1/namespaces/default/events', () =>
          HttpResponse.json({
            kind: 'EventList',
            items: [],
            metadata: {},
          })
        ),
        http.get('http://localhost:4466/api/v1/persistentvolumeclaims', () => HttpResponse.error()),
      ],
    },
  },
};

import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import Details from './ClassDetails';
import { BASE_SC } from './storyHelper';

export default {
  title: 'StorageClass/DetailsView',
  component: Details,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <TestContext routerMap={{ name: 'my-sc' }}>
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
        http.get('http://localhost:4466/apis/storage.k8s.io/v1/storageclasses/my-sc', () =>
          HttpResponse.json(BASE_SC)
        ),
        http.get('http://localhost:4466/apis/storage.k8s.io/v1/storageclasses', () =>
          HttpResponse.error()
        ),
      ],
    },
  },
};

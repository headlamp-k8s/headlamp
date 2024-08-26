import { Meta, StoryFn } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { TestContext } from '../../test';
import ListView from './ClassList';
import { BASE_PV } from './storyHelper';

export default {
  title: 'PersistentVolume/ListView',
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
        http.get('http://localhost:4466/apis/storage.k8s.io/v1/storageclasses', () =>
          HttpResponse.json({
            kind: 'PersistentVolumeList',
            items: [BASE_PV],
            metadata: {},
          })
        ),
      ],
    },
  },
};

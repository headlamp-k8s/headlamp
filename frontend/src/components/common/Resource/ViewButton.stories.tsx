import '../../../i18n/config';
import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import { KubeObject } from '../../../lib/k8s/KubeObject';
import store from '../../../redux/stores/store';
import ViewButton from './ViewButton';
import { ViewButtonProps } from './ViewButton';

export default {
  title: 'Resource/ViewButton',
  component: ViewButton,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
} as Meta;

const Template: StoryFn<ViewButtonProps> = args => <ViewButton {...args} />;

export const View = Template.bind({});
View.args = {
  item: {
    jsonData: {},
  } as KubeObject,
};

export const ViewOpen = Template.bind({});
ViewOpen.args = {
  item: {
    jsonData: {},
  } as KubeObject,
  initialToggle: true,
};

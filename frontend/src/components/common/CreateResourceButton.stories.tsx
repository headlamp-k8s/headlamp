import { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import { Provider } from 'react-redux';
import store from '../../redux/stores/store';
import { CreateResourceButton, CreateResourceButtonProps } from './CreateResourceButton';

export default {
  title: 'CreateResourceButton',
  component: CreateResourceButton,
  decorators: [
    Story => (
      <Provider store={store}>
        <Story />
      </Provider>
    ),
  ],
} as Meta;

const Template: StoryFn<CreateResourceButtonProps> = args => <CreateResourceButton {...args} />;

export const ConfigMap = Template.bind({});
ConfigMap.args = {
  resource: 'Config Map',
};

export const Secret = Template.bind({});
Secret.args = {
  resource: 'Secret',
};

export const Lease = Template.bind({});
Lease.args = {
  resource: 'Lease',
};

export const RuntimeClass = Template.bind({});
RuntimeClass.args = {
  resource: 'RuntimeClass',
};

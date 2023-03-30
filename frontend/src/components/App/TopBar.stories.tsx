import { configureStore } from '@reduxjs/toolkit';
import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { PureTopBar, PureTopBarProps } from './TopBar';

const store = configureStore({
  reducer: (state = { config: {}, ui: { notifications: [] } }) => state,
  preloadedState: {
    config: {},
    ui: {
      notifications: [],
    },
    plugins: {
      loaded: true,
    },
  },
});

export default {
  title: 'TopBar',
  component: PureTopBar,
  argTypes: {},
  decorators: [
    Story => {
      return (
        <MemoryRouter>
          <Provider store={store}>
            <Story />
          </Provider>
        </MemoryRouter>
      );
    },
  ],
} as Meta;

const Template: Story<PureTopBarProps> = args => {
  return <PureTopBar {...args} />;
};

export const NoToken = Template.bind({});
NoToken.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: false,
};

export const Token = Template.bind({});
Token.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: true,
};

export const OneCluster = Template.bind({});
OneCluster.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: true,
  cluster: 'ak8s-desktop',
  clusters: { 'ak8s-desktop': '' },
};

export const TwoCluster = Template.bind({});
TwoCluster.args = {
  appBarActions: [],
  logout: () => {},
  hasToken: true,
  cluster: 'ak8s-desktop',
  clusters: { 'ak8s-desktop': '', 'ak8s-desktop2': '' },
};

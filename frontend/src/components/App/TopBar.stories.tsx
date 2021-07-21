import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { createStore } from 'redux';
import { PureTopBar, PureTopBarProps } from './TopBar';

// eslint-disable-next-line no-unused-vars
const store = createStore((state = { config: {} }, action) => state, {
  config: {},
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
  appBarActions: {},
  logout: () => {},
  hasToken: false,
};

export const Token = Template.bind({});
Token.args = {
  appBarActions: {},
  logout: () => {},
  hasToken: true,
};

export const OneCluster = Template.bind({});
OneCluster.args = {
  appBarActions: {},
  logout: () => {},
  hasToken: true,
  cluster: 'ak8s-desktop',
  clusters: { 'ak8s-desktop': '' },
};

export const TwoCluster = Template.bind({});
TwoCluster.args = {
  appBarActions: {},
  logout: () => {},
  hasToken: true,
  cluster: 'ak8s-desktop',
  clusters: { 'ak8s-desktop': '', 'ak8s-desktop2': '' },
};

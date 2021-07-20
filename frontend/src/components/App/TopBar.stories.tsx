import { Meta, Story } from '@storybook/react/types-6-0';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { PureTopBar, PureTopBarProps } from './TopBar';

// eslint-disable-next-line no-unused-vars
const store = createStore((state = [], action) => state);

export default {
  title: 'TopBar',
  component: PureTopBar,
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

import { Meta, Story } from '@storybook/react/types-6-0';
import { SnackbarProvider } from 'notistack';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { PureAlertNotification, PureAlertNotificationProps } from './AlertNotification';

export default {
  title: 'AlertNotification',
  component: PureAlertNotification,
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
  decorators: [
    Story => (
      <MemoryRouter>
        <SnackbarProvider>
          <Story />
        </SnackbarProvider>
      </MemoryRouter>
    ),
  ],
} as Meta;

const Template: Story<PureAlertNotificationProps> = args => <PureAlertNotification {...args} />;

export const Error = Template.bind({});
Error.args = {
  testAuth: () => {
    return new Promise(function (resolve, reject) {
      reject('Offline');
    });
  },
  moreRoutes: {},
  routes: {},
};

export const NoError = Template.bind({});
NoError.args = {
  testAuth: () => {
    return new Promise(function (resolve) {
      resolve('fine');
    });
  },
  moreRoutes: {},
  routes: {},
};

import { Meta, StoryFn } from '@storybook/react';
import { SnackbarProvider } from 'notistack';
import { TestContext } from '../../test';
import { PureAlertNotification, PureAlertNotificationProps } from './AlertNotification';

export default {
  title: 'AlertNotification',
  component: PureAlertNotification,
  argTypes: {
    dispatch: { action: 'dispatch' },
  },
  decorators: [
    Story => (
      <TestContext>
        <SnackbarProvider>
          <Story />
        </SnackbarProvider>
      </TestContext>
    ),
  ],
} as Meta;

const Template: StoryFn<PureAlertNotificationProps> = args => <PureAlertNotification {...args} />;

export const Error = Template.bind({});
Error.args = {
  checkerFunction: () => {
    return new Promise(function (resolve, reject) {
      reject('Offline');
    });
  },
};

export const NoError = Template.bind({});
NoError.args = {
  checkerFunction: () => {
    return new Promise(function (resolve) {
      resolve({ statusText: 'OK' });
    });
  },
};

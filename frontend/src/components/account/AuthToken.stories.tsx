import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../test';
import { PureAuthToken, PureAuthTokenProps } from './Auth';

export default {
  title: 'AuthToken',
  component: PureAuthToken,
  argTypes: {
    onCancel: { action: 'cancel clicked' },
    onAuthClicked: { action: 'auth clicked' },
    onChangeToken: { action: 'token changed' },
    onCloseError: { action: 'error closed' },
  },
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

const Template: StoryFn<PureAuthTokenProps> = args => <PureAuthToken {...args} />;

export const ShowError = Template.bind({});
ShowError.args = {
  title: 'a title',
  token: 'a token',
  showError: true,
  showActions: false,
};

export const ShowActions = Template.bind({});
ShowActions.args = {
  title: 'a title',
  token: 'a token',
  showError: false,
  showActions: true,
};

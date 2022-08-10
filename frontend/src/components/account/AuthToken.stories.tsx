import { Meta, Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { PureAuthToken, PureAuthTokenProps } from './Auth';

// eslint-disable-next-line no-unused-vars
const store = createStore((state = { config: {}, ui: { notifications: [] } }, action) => state, {
  config: {},
  ui: {
    notifications: [],
  },
});

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
        <Provider store={store}>
          <Story />
        </Provider>
      );
    },
  ],
} as Meta;

const Template: Story<PureAuthTokenProps> = args => <PureAuthToken {...args} />;

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

import { Meta, Story } from '@storybook/react/types-6-0';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { PureAuthChooser, PureAuthChooserProps } from './index';

// eslint-disable-next-line no-unused-vars
const store = createStore((state = { config: {}, ui: { notifications: [] } }, action) => state, {
  config: {},
  ui: {
    notifications: [],
  },
});

export default {
  title: 'AuthChooser',
  component: PureAuthChooser,
  argTypes: {
    handleOidcAuth: { action: 'oidc code arrived' },
    handleTokenAuth: { action: 'use a token clicked' },
    handleTryAgain: { action: 'try again clicked' },
    handleBackButtonPress: { action: 'back button clicked' },
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

const Template: Story<PureAuthChooserProps> = args => <PureAuthChooser {...args} />;

const argFixture = {
  title: 'some title',
  testingTitle: 'some testing title',
  testingAuth: false,
  error: null,
  oauthUrl: 'http://example.com/',
  clusterAuthType: '',
  haveClusters: false,
};

export const BasicAuthChooser = Template.bind({});
BasicAuthChooser.args = {
  ...argFixture,
};

export const Testing = Template.bind({});
Testing.args = {
  ...argFixture,
  testingAuth: true,
};

export const HaveClusters = Template.bind({});
HaveClusters.args = {
  ...argFixture,
  haveClusters: true,
};

export const AuthTypeoidc = Template.bind({});
AuthTypeoidc.args = {
  ...argFixture,
  clusterAuthType: 'oidc',
};

export const AnError = Template.bind({});
AnError.args = {
  ...argFixture,
  error: Error('Oh no! Some error happened?!?'),
};

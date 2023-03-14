import { Meta, Story } from '@storybook/react/types-6-0';
import { TestContext } from '../../test';
import { PureAuthChooser, PureAuthChooserProps } from './index';

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
        <TestContext>
          <Story />
        </TestContext>
      );
    },
  ],
} as Meta;

const Template: Story<PureAuthChooserProps> = args => <PureAuthChooser {...args} />;

const argFixture = {
  clusterName: 'some-cluster',
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

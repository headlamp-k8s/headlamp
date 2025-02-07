import Button from '@mui/material/Button';
import { Meta, StoryFn } from '@storybook/react';
import { TestContext } from '../../test';
import OauthPopup from './OauthPopup';

export default {
  title: 'Oidcauth/OauthPopup',
  component: OauthPopup,
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

const Template: StoryFn<typeof OauthPopup> = args => {
  return <OauthPopup {...args}>Open Auth Popup</OauthPopup>;
};

export const Default = Template.bind({});
Default.args = {
  url: 'https://example.com/auth',
  title: 'Auth Popup',
  button: Button,
  onCode: code => {
    console.log('Received code:', code);
  },
};

export const WithDimensions = Template.bind({});
WithDimensions.args = {
  url: 'https://example.com/auth',
  title: 'Auth Popup',
  height: 1000,
  width: 1000,
  button: Button,
  onCode: code => {
    console.log('Received code:', code);
  },
};

import { StorybookConfig } from '@storybook/react-vite';

export default {
  framework: '@storybook/react-vite',
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],

  core: {
    disableTelemetry: true,
  },

  docs: {},

  typescript: {
    reactDocgen: 'react-docgen-typescript',
  },
} satisfies StorybookConfig;

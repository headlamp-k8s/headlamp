const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  stories: ['../../../../../src/**/*.mdx', '../../../../../src/**/*.stories.@(js|jsx|ts|tsx)'],

  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
  ],

  core: {
    disableTelemetry: true,
  },

  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },

  // https://storybook.js.org/docs/react/configure/typescript#mainjs-configuration
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
  },

  webpackFinal: async config => {
    let newConfig = {
      ...config,
      resolve: {
        ...config.resolve,
        fallback: {
          ...config.fallback,
          crypto: require.resolve('crypto-browserify'),
          http: require.resolve('stream-http'),
          https: require.resolve('https-browserify'),
          path: require.resolve('path-browserify'),
          stream: require.resolve('stream-browserify'),
          vm: require.resolve('vm-browserify'),
        },
      },
    };

    // To find and use the tsconfig inside the plugin.
    newConfig.resolve.plugins = [...(config.resolve.plugins || []), new TsconfigPathsPlugin()];

    return newConfig;
  },

  docs: {},
};

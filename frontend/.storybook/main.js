module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links', 
    '@storybook/addon-essentials',
    // '@storybook/addon-interactions',
    '@storybook/preset-create-react-app',
  ],
  core: {
    builder: 'webpack5',
    disableTelemetry: true,
  },
  webpackFinal: config => {
    return {
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
          vm: require.resolve("vm-browserify"),
        },
      },
    };
  },
};

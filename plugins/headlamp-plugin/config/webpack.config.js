const externalModules = {
  '@material-ui/core': 'pluginLib.MuiCore',
  '@material-ui/lab': 'pluginLib.MuiLab',
  '@material-ui/styles': 'pluginLib.MuiStyles',
  react: 'pluginLib.React',
  'react/jsx-runtime': 'pluginLib.ReactJSX',
  recharts: 'pluginLib.Recharts',
  'react-router': 'pluginLib.ReactRouter',
  'react-redux': 'pluginLib.ReactRedux',
  'react-dom': 'pluginLib.ReactDOM',
  '@iconify/react': 'pluginLib.Iconify',
  lodash: 'pluginLib.Lodash',
  notistack: 'pluginLib.Notistack',
  '@kinvolk/headlamp-plugin/lib/CommonComponents': 'pluginLib.CommonComponents',
  '@kinvolk/headlamp-plugin/lib/K8s': 'pluginLib.K8s',
  // We also point k8s (lowercase) to it, since users may use it instead as it's closer to
  // how it's used in Headlamp's source code.
  '@kinvolk/headlamp-plugin/lib/k8s': 'pluginLib.K8s',
  '@kinvolk/headlamp-plugin/lib': 'pluginLib',
};

module.exports = {
  mode: 'production',
  resolveLoader: {
    modules: ['node_modules'],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  externals: function ({ request }, callback) {
    const pluginLib = externalModules[request];
    // For cases like: import { Grid } from '@material-ui/core'
    if (!!pluginLib) {
      return callback(null, pluginLib);
    }

    // For cases like:
    // import Grid from '@material-ui/core/Grid' -> const Grid = pluginLib.MuiCore["Grid"];
    for (const importModule of Object.keys(externalModules)) {
      const modulePrefix = importModule + '/';
      if (request.startsWith(modulePrefix)) {
        const submodule = request.replace(modulePrefix, '').replace(/\/+/g, '');
        return callback(null, `${externalModules[importModule]}["${submodule}"]`);
      }
    }

    // Default
    callback();
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: require.resolve('babel-loader'),
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'].map(require.resolve).concat([
              [
                require.resolve('@babel/preset-react'),
                {
                  runtime: 'automatic',
                },
              ],
            ]),
            plugins: ['@babel/plugin-proposal-class-properties'].map(require.resolve).concat([
              [
                require.resolve('@babel/plugin-transform-react-jsx'),
                {
                  runtime: 'automatic',
                },
              ],
            ]),
          },
        },
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: require.resolve('@svgr/webpack'),
            options: {
              prettier: false,
              svgo: false,
              svgoConfig: {
                plugins: [{ removeViewBox: false }],
              },
              titleProp: true,
              ref: true,
            },
          },
        ],
        issuer: {
          and: [/\.(ts|tsx|js|jsx|md|mdx)$/],
        },
      },
      {
        test: /\.(jpe?g|gif|png)$/i,
        use: [
          {
            loader: require.resolve('url-loader'),
            options: {
              limit: 9999999999999,
            },
          },
        ],
      },
    ],
  },
};

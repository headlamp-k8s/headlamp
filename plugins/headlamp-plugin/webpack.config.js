const path = require('path');

// Webpack configuration to bundle bin/plugin-management.js
module.exports = {
  mode: 'production',
  target: 'node',
  entry: './bin/plugin-management.js', // Entry file
  output: {
    path: path.resolve(__dirname, 'bin/dist'), // Output directory
    filename: 'plugin-management.js', // Output filename
  },
  resolveLoader: {
    modules: ['node_modules'],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      core: path.resolve(__dirname, 'core'),
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Apply rule to JavaScript files
        exclude: /node_modules/, // Exclude node_modules directory
        use: {
          loader: 'babel-loader', // Use babel-loader for transpiling
          options: {
            presets: ['@babel/preset-env'], // Use @babel/preset-env for compatibility
          },
        },
      },
    ],
  },
};

const path = require('path');
const NodeExternalsPlugin = require('webpack-node-externals');

module.exports = {
  mode: 'development', // Set the mode to development
  target: 'node', // Set the target to Node
  entry: './plugin-management.js', // Replace 'your_script.js' with the path to your JavaScript file
  output: {
    path: path.resolve(__dirname, 'dist'), // Output directory
    filename: 'bundle.js', // Output filename
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
  externals: [NodeExternalsPlugin({ includeAllDependencies: true })], // Exclude node_modules from the bundle
};

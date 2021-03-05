module.exports = {
  mode: 'production',
  resolveLoader: {
    modules: ['node_modules']
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules:[{
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'].map(require.resolve),
          plugins: ['@babel/plugin-proposal-class-properties', '@babel/plugin-transform-react-jsx'].map(require.resolve)
        }
      }
    }]
  }
}

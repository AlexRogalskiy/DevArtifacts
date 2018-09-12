const path = require('path')
const webpack = require('webpack')

const defaultPath = '__tests__/visual/'

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      'react-hot-loader/patch',
      path.resolve(__dirname, defaultPath, 'index.jsx'),
    ],
  },
  devtool: 'inline-sourcemap',
  cache: true,
  output: {
    path: path.resolve(__dirname, defaultPath, 'dist/'),
    filename: '[name].js',
    publicPath: '/static/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, defaultPath),
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader?babelrc',
        },
      },
    ],
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
  ],
}

/**
 * External dependencies
 */
import path from 'path';
import webpack from 'webpack';

/**
 * Local variables
 */
const PATHS = {
  app: path.join(__dirname, 'client/index.jsx'),
  build: path.join(__dirname, 'public/js'),
};

/**
 * Webpack config
 */
const config = {
  entry: [
    PATHS.app,
    'webpack/hot/dev-server',
    'webpack-dev-server/client?http://localhost:8080/',
  ],
  output: {
    path: PATHS.build,
    filename: 'bundle.js',
    publicPath: '/public/js',
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)?$/,
        exclude: /node_modules/,
        loader: 'react-hot!babel',
      },
      {
        test: /\.(sass|scss)$/i,
        exclude: /node_modules/,
        loader: 'style!css?sourceMap!sass?sourceMap',
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
        NODE_ENV: JSON.stringify('development'),
      },
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  devServer: {
    hot: true,
    contentBase: './',
  },
};

export default config;

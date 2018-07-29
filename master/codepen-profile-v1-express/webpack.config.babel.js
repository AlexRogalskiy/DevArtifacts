/**
 * External dependencies
 */
import path from 'path';
import webpack from 'webpack';

/**
 * Local variables
 */
const PATHS = {
  app: path.join(__dirname, 'client/index.js'),
  build: path.join(__dirname, 'public'),
};

/**
 * Webpack config
 */
const config = {
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    PATHS.app,
  ],
  output: {
    path: PATHS.build,
    publicPath: '/',
    filename: 'bundle.js',
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
        loader: 'babel',
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
};

export default config;

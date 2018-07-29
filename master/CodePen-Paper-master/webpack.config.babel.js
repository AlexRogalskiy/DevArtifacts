/**
 * External dependencies
 */
import path from 'path';
import webpack from 'webpack';

/**
 * Local variables;
 */
const __PATHS__ = {
  app: path.join(__dirname, 'client/index.js'),
  public: path.join(__dirname, 'public'),
  node_modules: path.join(__dirname, './node_modules'),
  source: path.join(__dirname, './'),
};

/**
 * Webpack Config
 */
const config = {
  devtool: '#source-map',
  context: __PATHS__.source,
  entry: [
    'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
    __PATHS__.app,
  ],
  output: {
    path: __PATHS__.public,
    publicPath: '/public',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ],
      },
      {
        test: /\.(sass|scss)$/,
        exclude: /node_modules/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      __PATHS__.source,
    ],
  },
  plugins: [
    new webpack.ContextReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  node: {
    fs: 'empty',
  },
};

export default config;

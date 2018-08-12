const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'start';

const config = {
  devtool: (isDev) ? 'eval' : 'source-map',

  entry: {
    app: './app/init.js',
    vendor: './app/vendor.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[chunkhash].app.js',
    publicPath: '/'
  },

  module: {
    rules: [
    {
      test: /\.html$/,
      use: 'html-loader'
    }, {
      test: /\.(png|jpg|svg)$/,
      use: 'file-loader?name=img/[name].[ext]'
    }, {
      test: /\.js$/,
      exclude: /(node_modules)/,
      use: ['babel-loader']
    }, {
      test: /\.css$/,
      use: 'style-loader!css'
    }, {
      test: /\.scss$/,
      use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader']
    }]
  },

  devServer: {
    contentBase: 'dist/',
    historyApiFallback: true,
    compress: true,
    clientLogLevel: 'info',
    port: 8010,
    inline: true,
    filename: 'bundle.js',
    publicPath: '/',
    watchOptions: {
      aggregateTimeout: 0,
      poll: 500
    },
    stats: { colors: true }
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      include: /\.min\.js$/,
      compressor: { warnings: false },
      sourceMap: true,
      compress: { drop_console: true },
      minimize: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: '[chunkhash].vendor.js',
      minChunks: 'Infinity'
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.html'
    }),
    new webpack.LoaderOptionsPlugin({
      test: /\.tpl.html$/, // may apply this only for some modules
      options: {
        htmlLoader: {
          minimize: false
        },
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': '"production"'
      }
    }),

  ],

  resolve: {
    modules: [ path.resolve(__dirname, 'app'), 'node_modules' ]
  }

};

module.exports = config;

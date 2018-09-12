const webpack = require('webpack')
const path = require('path')

module.exports = {
  entry: {
    Templates: [
      path.resolve('./Templates.js'),
    ],
  },
  cache: false,
  output: {
    path: path.resolve('dist/'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: [{
          loader: 'babel-loader',
        }]
      },
    ]
  }
}

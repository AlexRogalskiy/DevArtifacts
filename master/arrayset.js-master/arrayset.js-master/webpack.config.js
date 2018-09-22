const path = require('path')

module.exports = {
  entry: './src/arrayset.js',
  output: {
    filename: 'arrayset.js',
    libraryTarget: 'commonjs2',
    path: path.resolve(__dirname, 'build')
  },
  devtool: 'source-map',
  mode: 'production',
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
    ]
  }
}

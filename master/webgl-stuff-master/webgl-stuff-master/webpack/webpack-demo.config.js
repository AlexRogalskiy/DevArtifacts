/**
 * Created by vlad.chirkov on 10/4/17.
 */
const path = require('path');
const merge = require('webpack-merge');

const base = require('./webpack-base.config');

module.exports = merge({}, base, {
    name: 'demo',
    entry: path.resolve(__dirname, '../demo/index.js'),
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, '../dist/demo'),
        filename: 'index.js'
    }
});
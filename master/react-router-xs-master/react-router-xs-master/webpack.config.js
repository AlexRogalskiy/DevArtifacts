const pkg = require('./package.json');
const path = require('path');
const webpack = require('webpack');
const CaseSensitivePlugin = require('case-sensitive-paths-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const NotifierPlugin = require('webpack-notifier');

const config = module.exports = {
    profile: true,
    entry: {
        index: path.resolve('./src/index.js'),
    },
    output: {
        path: path.resolve('./dist'),
        publicPath: '/dist/',
        filename: '[name].min.js',
        library: pkg.name,
        libraryTarget: 'umd',
        umdNamedDefine: true,
    },
    plugins: [
        new CaseSensitivePlugin(),
        new CleanPlugin('./dist', {
            root: path.resolve('./'),
            verbose: true
        }),
        new webpack.EnvironmentPlugin(['NODE_ENV']),
        new NotifierPlugin({
            title: pkg.name,
            alwaysNotify: true,
        }),
    ],
    module: {
        rules: [{
            test: /\.(js|jsx|mjs)$/i,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                },
            }],
        }],
    },
    resolve: {
        alias: {
            'prop-types': path.resolve(__dirname, './node_modules/prop-types'),
            'react': path.resolve(__dirname, './node_modules/react') ,
            'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
        },
    },
    externals: {
        'prop-types': {
            root: 'PropTypes',
            amd: 'prop-types',
            commonjs: 'prop-types',
            commonjs2: 'prop-types',
        },
        react: {
            root: 'React',
            amd: 'react',
            commonjs: 'react',
            commonjs2: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            amd: 'react-dom',
            commonjs: 'react-dom',
            commonjs2: 'react-dom',
        },
    },
};

if(process.env.NODE_ENV === 'development') {
    config.devtool = 'eval-sourcemap';
}
else {
    config.devtool = 'source-map';

    config.optimization = {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                cache: true,
                sourceMap: true,
                uglifyOptions: {
                    compress: {
                        inline: false,
                    },
                    keep_fnames: true,
                    keep_classnames: true,
                },
            }),
        ],
    };

    config.plugins = [
        ...config.plugins,
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            defaultSizes: 'gzip',
        }),
    ];
}
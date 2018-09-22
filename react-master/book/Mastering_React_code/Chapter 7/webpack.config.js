var path    = require('path')
,   webpack = require('webpack')
;

module.exports = {
	entry: [
		'webpack-dev-server/client?http://localhost:8080', // WebpackDevServer host and port
		'webpack/hot/only-dev-server',
		'babel-polyfill',
		'./js/app' // Your appʼs entry point
    ],
    output: {
        filename: "js/bundle.js"
    },
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),

		// example of polyfilling with webpack 
		// OR just include the babel runtime option below and get Promises, Generators, Map, and much more!
		// You can even get forward looking proposed features for ES7 and beyond with the 
		// stage query parameter below https://babeljs.io/docs/usage/experimental/ welcome
		// to the future of JavaScript! :)
		//
		//new webpack.ProvidePlugin({
		//	'arrayutils': 'imports?this=>global!exports?global.arrayutils!arrayutils'
		//})
	],
	resolve: {
		// require files in app without specifying extensions
		extensions: ['', '.js', '.json', '.jsx', '.less'],
		alias: {
			// pretty useful to have a starting point in nested modules
			'appRoot': path.join(__dirname, 'js'),
			'vendor': 'appRoot/vendor'
		}
	},
    module: {
        loaders: [
			{ test: /\.less$/,      loader: 'style-loader!css-loader!autoprefixer?browsers=last 2 version!less-loader' },
			{ test: /\.css$/,       loader: 'style-loader!css-loader' },
			{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'}, // inline base64 URLs for <=8k images, direct URLs for the rest
			{ 
				test: /\.jsx?$/, 
				include: [
					path.join(__dirname, 'js'), // files to apply this loader to
					path.join(__dirname, 'node_modules/reflux-core')
				], 
				// http://jamesknelson.com/using-es6-in-the-browser-with-babel-6-and-webpack/
				loaders: ['react-hot', 'babel?presets[]=react,presets[]=es2015', 'reflux-wrap-loader'] // loaders process from right to left
			}
        ]
    }
};

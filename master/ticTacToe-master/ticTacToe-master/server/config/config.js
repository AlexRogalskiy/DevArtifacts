'use strict';

/** * Environment variables and application configuration. */
var path = require('path'),
	_ = require('lodash');

var baseConfig = {
	app: {
		root: path.normalize(__dirname + '/../..'),
		env: process.env.NODE_ENV || 'dev'
	}
};

// environment specific config overrides
var platformConfig = {
	dev: {
		log: {
			level : 'debug',
			path: __dirname + "/../../logs/tictactoe.log",
		},

		app: {
			port: 8080,
			uploadDir: __dirname + "/../../uploads"
		}
	},

	beta: {},

	prod: {}
};

// override the base configuration with the platform specific values
module.exports = _.merge(baseConfig, platformConfig[baseConfig.app.env]);

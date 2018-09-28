'use strict';
var fs = require('fs'),
	mongoose = require('mongoose'),
	self = exports,
	inited = false,
	lm = require('./utils/logger');

exports.init = (config) => {
	if (inited) return;
	inited = true;

	self.config = config;

	lm.init(config);
	self.logger = lm.root;

	self.initDir('/utils', 'utils');
	//self.initDir('/models', 'models');
};

exports.initDir = ( dir, key ) => {
	let self = exports[key] = {};
	let models_path = __dirname + dir;
	fs.readdirSync(models_path).forEach(function (file) {
		if (~file.indexOf('js')) {
			self[file.substring(0, file.length - 3)] = require(models_path + '/' + file);
		}
	});
};

exports.initDB = function * () {
	var db = exports.db = {};
	let config = self.config;
	let promises = [];

	lm.root.trace('Config file details: ', config);

	mongoose.set('debug', config.mongo.debug);
	promises.push( new Promise((resolve, reject) => {
			mongoose.connection.on('disconnected', (err) => {
				lm.root.error('Connection could not be established with mongodb: %s', config.mongo.url, err);
				reject(err);
			});
			mongoose.connection.on('connected', () => {
				lm.root.info('Connection established with mongodb: %s', config.mongo.url);
				db.mongoose = mongoose;
				resolve(true);
			});
		})
	);

	let dburl = self.utils.util.makeMongoUrl( config.mongo.dbhost, config.mongo.dbname,
		config.mongo.user, config.mongo.password );
	lm.root.info( "Connecting to mongo ...", dburl );
	if(config.app.env !== 'dev')
		mongoose.connect( dburl, { user : config.mongo.user, pass : config.mongo.password, auth : { authSource : 'admin' } } );
	else
		mongoose.connect( dburl );

	yield promises;
};

/**
 * Detect Chrome extension
 */
'use strict';

const os = require('os');
const path = require('path');
const fs = require('graceful-fs');
const launcher = require('browser-launcher2');
const debug = require('debug')('lsapp:detect-chrome');
const utils = require('../node-utils');
const identify = require('../identify');

/**
 * Returns a promise that fulfilled if user has installed Chrome extension
 * @param {Object} app App definition
 * @param {LivestyleClient} client A LiveStyle WebSocket client
 * @return {Promise}
 */
module.exports = function(app, client) {
	debug('detecting Chrome browser extension');
	return identify(client, 'chrome')
	.catch(err => detectApp(app))
	.then(() => detectPlugin(app));
};

var detectApp = module.exports.app = function(app) {
	return new Promise(function(resolve, reject) {
		launcher.detect(function(browsers) {
			debug('browser found: %d', browsers.length);
			var hasChrome = browsers.some(function(browser) {
				return browser.type === 'chrome';
			});
			debug('has Chrome installed? %o', hasChrome);
			if (hasChrome) {
				resolve();
			} else {
				var err = new Error('No Chrome browser installed');
				err.code = 'EDETECTNOCHROME';
				reject(err);
			}
		});
	});
}

var detectPlugin = module.exports.plugin = function(app) {
	return utils.pathContents(app.lookup)
	.then(function(found) {
		var extPath = null;
		found.some(function(obj) {
			return obj.items.some(function(item) {
				if (app.extensionId.indexOf(item) !== -1) {
					return extPath = path.join(obj.path, item);
				}
			});
		});
		
		return extPath || false;
	});
}
/**
 * GitHub Release auto-update module for OSX app.
 * Fetches all releases for current project repo and finds most recent one.
 * Then it checks if there is a `osx-auto-update.json` asset exists. If so,
 * returns it as auto-update feed URL.
 */
'use strict';

const ghRelease = require('./gh-release');

const feedFile = 'osx-auto-update.json';

module.exports = function(pkg) {
	return ghRelease.findUpdateRelease(pkg)
	.then(release => {
		var feed = release.assets[feedFile];
		if (!feed) {
			return ghRelease.warn(`No ${feedFile} asset in latest ${release.name} release`);
		}

		return feed.browser_download_url;
	});
};
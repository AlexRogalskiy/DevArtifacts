Logger = {
	warn: function(string) {
		console.log('Warn: ', string);
	},

	error: function(string) {
	console.log('Error: ', string);
	},

	info: function (string) {
		console.log('Info: ', string);
	}
};


exports.warn = Logger.warn;
exports.info = Logger.info;
exports.error = Logger.error;
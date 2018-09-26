var fs = require('fs');

function getFile(filename) {
	return fs.createReadStream(filename);
}

module.exports = getFile;
var http = require('http');
var debug = require('debug')('server');

var server = new http.Server(); // EventEmitter

server.on('request', require('./request'));

server.listen(1337, 'localhost');

debug('Server is running');
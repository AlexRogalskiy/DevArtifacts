var http = require('http'),
    requestHandler = require('./fn');

var port = 4000;
var server = http.createServer();

server.on('request', requestHandler).listen(port);

console.log('Server is running on port ' + port);
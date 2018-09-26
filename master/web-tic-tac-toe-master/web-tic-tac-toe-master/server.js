var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname + '/public/')).listen(8080, function () {
    console.log('Tic-Tac-Toe running on 8080...');
});
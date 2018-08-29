var Evmitter = require('events').EventEmitter,
	app = require('express')();

var iEvmitter = new Evmitter();
var dataz = "success";

iEvmitter.emit('event', dataz);
iEvmitter.on('event', function(message){
	console.log(message)
});

app.listen(3000);
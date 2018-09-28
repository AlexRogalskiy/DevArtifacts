'use strict';

var tttcommon = require( 'ttt-common' ),
	l = tttcommon.logger.child( {'module': __filename.substring(__dirname.length+1, __filename.length-3)} ),
	config = tttcommon.config,
	send = require('koa-send'),
	responseTime = require("koa-response-time"),
	parse = require('koa-better-body');

module.exports = function (app) {
	app.use( function * ( next ) {
		this.req.connection.setTimeout( 0 );
		this.req.connection.setNoDelay( true );
		try {
			yield next;
		} catch( err ) {
      l.error( { err: err } );
      this.status = err.status || 500;
      this.body = err.message;
      this.app.emit( 'error', err, this );
		}
	} );

	app.use( responseTime() );

	app.use( parse( { multipart: true, formidable: { uploadDir: config.app.uploadDir } } ) );
	app.use( function*( next ) {
		this.log = l;
		l.debug("got req ", this.request);
		yield next;
	} );

	// send static resources if any
	app.use( function * ( next ) {
		if( !(/\/v\d+\//i.test( this.request.url ) ) ) {
			yield send( this, '/index.html', { root: config.app.root + '/views' } );
		} else {
			this.log.debug('JSON api request');
			yield next;
		}
	} );
};

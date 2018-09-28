'use strict';
var b = require( 'bunyan' );
let cluster = require( 'cluster' );

b.prototype.close = function ( f ) {
	if (!this._isSimpleChild) {
		this.streams.forEach(function (s) {
			if (s.closeOnExit) {
				console.log('closing stream s:', s);
				s.stream.end( f );
				s.closeOnExit = false;
			}
		});
	}
};

var lm = module.exports = {};

lm.init = ( config ) => {
	let logpath = config.log.path;
	let logfileid = cluster.worker ? cluster.worker.id : '1';
	logpath = logpath.replace( /.log$/, logfileid + '.log' );

	lm.root = b.createLogger( {
		name : 'root',
		serializers: {
			err: b.stdSerializers.err,
			req: b.stdSerializers.req,
			res: b.stdSerializers.res,
			user: function (u) { if (u) return u._id; }
		},
		streams : [
			{
				level: config.log.level,
				stream: process.stdout
			},
			{
				type : 'rotating-file',
				path : logpath,
				count : 7,
				period : '1d',
				level : config.log.level
			}
		]});
};

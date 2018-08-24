// refactored from gulp-requirejs-optimize
// https://www.npmjs.com/package/gulp-requirejs-optimize/

/*jshint node: true, unused: true, undef: true */

var gutil = require('gulp-util');
var transfob = require('transfob');
var requirejs = require('requirejs');
var chalk = require('chalk');

requirejs.define( 'node/print', [], function() {
  return function( message ) {
    message = message.substring(0, 5) === 'Error' ?
      chalk.red( message ) : message;
    gutil.log( message );
  };
});

module.exports = function rjsOptimize( options ) {

  options = options || {};
  options.logLevel = 2;

  var stream = transfob( function( file, encoding, callback ) {

    options.out = function( text ) {
      var outFile = new gutil.File({
        path: file.relative,
        contents: new Buffer( text )
      });
      callback( null, outFile );
    };

    gutil.log('RequireJS optimizing');
    requirejs.optimize( options, null, function( err ) {
      var gulpError = new gutil.PluginError( 'requirejsOptimize', err.message );
      stream.emit( 'error', gulpError );
    });
  });

  return stream;
};

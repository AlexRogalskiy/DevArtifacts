var fs = require('fs');
var path = require('path');
var handlebars = require('handlebars');
var marked = require('marked');

var highlight = require('./utils/highlight');
var parseJSONFrontMatter = require('./utils/parse-json-front-matter');

// -------------------------- helpers -------------------------- //

function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function getFilename( filepath ) {
  return path.basename( filepath, path.extname( filepath ) );
}

// -------------------------- Handlebar Helpers -------------------------- //

// https://gist.github.com/meddulla/2571518
handlebars.registerHelper( 'if_equal', function( a, b, options ) {
  if ( a == b ) {
    return options.fn( this );
  }
});

handlebars.registerHelper( 'slug', function( str ) {
  return str.replace( /[?\(\)]+/g, '' ).replace( /[\., \/]+/gi, '-' ).toLowerCase();
});

// --------------------------  -------------------------- //

module.exports = function( grunt ) {

  grunt.registerMultiTask( 'template', 'Generate Handlebars templates', function() {
    var opts = this.options();

    // register any helpers
    for ( var helperName in opts.helpers ) {
      handlebars.registerHelper( helperName, opts.helpers[ helperName ] );
    }

    var templateFiles = grunt.file.expand( opts.templates );
    // hash of Handlebar templates
    var templates = {};
    templateFiles.forEach( function( filepath ) {
      var name = path.basename( filepath, path.extname( filepath ) );
      var src = grunt.file.read( filepath );
      templates[ name ] = handlebars.compile( src );
      // register all as partials
      handlebars.registerPartial( name, src );
    });

    // get data
    var data = {};
    if ( opts.dataFiles ) {
      var dataFiles = grunt.file.expand( opts.dataFiles );
      dataFiles.forEach( function( filepath ) {
        var name = getFilename( filepath );
        data[ name ] = grunt.file.readJSON( filepath );
      });
    }

    // register any partial files
    for ( var partialName in opts.partialFiles ) {
      var partialFile = opts.partialFiles[ partialName ];
      var content = marked( grunt.file.read( partialFile ) );
      handlebars.registerPartial( partialName, content );
    }

    // properties made available for templating
    var dataDir = grunt.config.get('dataDir');
    var site = {};
    // read file paths from JSON
    site.css = grunt.file.expand( grunt.file.readJSON( dataDir + '/css-sources.json' ) );
    site.js = grunt.file.expand( grunt.file.readJSON( dataDir + '/js-sources.json' ) );
    // data used across site
    var siteContext = {
      site: site,
      is_dev: grunt.option('dev')
    };
    // add data
    siteContext = extend( siteContext, data );

    this.files.forEach( function( file ) {
      file.src.forEach( function( filepath ) {
        // skip directories
        if ( fs.lstatSync( filepath ).isDirectory() ) {
          return;
        }
        var splitPath = filepath.split( path.sep );
        // remove leading directory
        if ( splitPath.length > 1 ) {
          splitPath.splice( 0, 1 );
        }
        // first process page source
        var src = grunt.file.read( filepath );
        var parsed = parseJSONFrontMatter( src );
        src = parsed.src;
        var pageJson = parsed.json || {};
        var context = {
          basename: path.basename( filepath, path.extname( filepath ) ),
          page: pageJson,
          // 404 pages should have / root paths
          root_path: pageJson.is404 ? '/' : Array( splitPath.length ).join('../')
        };
        context = extend( context, siteContext );
        // compile content
        var content = handlebars.compile( src )( context );
        content = highlight( content );
        context.content = content;

        // process source into page template
        var templated = templates[ opts.defaultTemplate ]( context );
        var dest = file.dest + splitPath.join( path.sep );
        grunt.file.write( dest, templated );
      });
    });
  });

};

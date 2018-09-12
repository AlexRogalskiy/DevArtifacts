/**
 * General Grunt setup
 */
'use strict';

/*
 * Call Grunt configuration
 */
module.exports = function (grunt) {

  // Load project configuration
  grunt.initConfig({
    pkg: require('./package'),
    phantomas: {
      site : {
        options : {
          indexPath: './phantomas/',
          options: {
            assetsWithQueryString: 3,
            bodyHTMLSize: 10500,
            jsErrors: 0,
            gzipRequests: {
              type: '<',
              value: 10
            }
          },
          url: 'http://facebook.com/',
          buildUi: true
        }
      }
    }
  });

  // Load all grunt tasks
  grunt.loadNpmTasks('grunt-phantomas');


  grunt.registerTask('default', ['phantomas']);
};

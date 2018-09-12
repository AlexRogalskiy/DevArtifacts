'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    jshint: {
      all: ['./js/**/*.js']
    },

    sass: {
      dist: {
        files: [{
          cwd: './sass/',
          src: ['*.scss'],
          dest: '.css/'
        }]
      }
    },

    watch: {
      js: {
        files: ['./js/**/*.js'],
        tasks: ['jshint']
      },
      sass: {
        files: ['./sass/**/*.scss'],
        tasks: ['sass']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['sass']);
};

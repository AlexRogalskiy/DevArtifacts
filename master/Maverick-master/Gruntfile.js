/* Maverick's Gruntfile
 * http://github.com/andyhqtran/Maverick
 * Copyright 2015 Maverick
 * Licensed under MIT(https: //github.com/andyhqtran/Maverick/master/LICENSE)
 */

module.exports = function (grunt) {
  'use strict';

  // Load all Grunt task
  require('load-grunt-tasks')(grunt);

  // Project
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    project: {
      assets: ['assets'],
      css: ['<%= project.assets %>/css'],
      sass: ['<%= project.assets %>/scss'],
      js: ['<%= project.assets %>/js']
    },

    // Connect
    connect: {
      server: {
        options: {
          port: 3000,
          base: '.',
        }
      }
    },

    // Jade
    jade: {
      options: {
        pretty: true
      },

      // jade:dev
      dev: {
        files: {
          'index.html': 'index.jade'
        }
      }
    },

    // Sass
    sass: {
      options: {
        precision: 6,
        sourcemap: 'auto',
        style: 'expanded',
        trace: true
      },

      // sass:dev
      dev: {
        files: {
          '<%= project.css %>/main.css': '<%= project.sass %>/main.scss'
        }
      }
    },

    // Autoprefixer
    autoprefixer: {
      options: {
        browsers: ['last 2 versions']
      },

      // sass:dev
      dev: {
        files: {
          '<%= project.css %>/main.css': '<%= project.css %>/main.css'
        }
      }
    },

    // Wiredep
    wiredep: {
      options: {
        dependencies: true,
        devDependencies: true,
        "overrides": {
          // "bootstrap": {
          //   "main": [
          //     "dist/js/bootstrap.js",
          //     "dist/css/bootstrap.css",
          //   ]
          // },
          "font-awesome": {
            "main": [
              "css/font-awesome.css",
              "less/font-awesome.less",
              "scss/font-awesome.scss"
            ]
          }
        },
      },

      // wiredep:dev
      dev: {
        src: [
          'index.html'
        ]
      }
    },

    // Watch
    watch: {
      options: {
        livereload: true,
        dateFormat: function (time) {
          grunt.log.writeln('Grunt the Amazing Wizard has cast a spell in ' + time + 'ms!');
          grunt.log.writeln('Preparing for the next spell...');
          grunt.log.write('\x07'); // beep!
        },
        event: ['all']
      },

      // Gruntfile
      configFiles: {
        files: ['Gruntfile.js'],
        tasks: ['notify:grunt'],
        options: {
          reload: true
        }
      },
      // Jade
      jade: {
        files: '{,*/,*/*/,*/*/*/}*.jade',
        tasks: ['jade', 'wiredep', 'notify:jade'],
      },

      // Sass
      sass: {
        files: '<%= project.assets %>/scss/{,*/,*/*/,*/*/*/}*.{scss,sass}',
        tasks: ['sass', 'autoprefixer', 'notify:sass'],
      }
    },

    // Notify
    notify: {
      options: {
        title: 'Grunt'
      },

      // notify:server
      server: {
        options: {
          message: 'Grunt has been initiated.'
        }
      },

      // notify:grunt
      grunt: {
        options: {
          message: 'Gruntfile has been updated.'
        }
      },

      // notify:jade
      jade: {
        options: {
          message: 'Jade files has been compiled.'
        }
      },

      // notify:sass
      sass: {
        options: {
          message: 'Sass files has been compiled.'
        }
      }
    }
  });

  grunt.registerTask('default', ['connect:server', 'notify:server', 'watch']);

};
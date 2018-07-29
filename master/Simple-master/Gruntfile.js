module.exports = function (grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    project: {
      assets: ['assets'],
      css: ['<%= project.assets %>/css'],
      sass: ['<%= project.assets %>/sass'],
      js: ['<%= project.assets %>/js']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '',
        }
      }
    },

    clean: {
      html: '{,*/,*/*/,*/*/*/}*.html',
      css: '<%= project.css %>{,*/,*/*/,*/*/*/}*.{css,map}',
      cache: '.sass-cache',
      bower: 'bower_components',
      npm: 'node_modules'
    },


    jade: {
      dist: {
        options: {
          pretty: true
        },
        files: {
          'index.html': 'index.jade'
        }
      }
    },

    wiredep: {
      task: {
        src: [
          'index.html'
        ],
        options: {
          dependencies: true,
          devDependencies: true,
          'overrides': {
            'font-awesome': {
              'main': [
                'less/font-awesome.less',
                'scss/font-awesome.scss',
                'css/font-awesome.css'
              ]
            }
          }
        }
      }
    },

    sass: {
      dev: {
        options: {
          sourcemap: 'auto',
          style: 'expanded'
        },
        files: {
          '<%= project.css %>/main.css': '<%= project.sass %>/main.scss'
        }
      }
    },

    postcss: {
      options: {
        map: true,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions', 'ie 8']
          })
        ]
      },
      dev: {
        src: '<%= project.css %>/*.css'
      }
    },

    notify: {
      options: {
        title: 'GruntJS'
      },
      server: {
        options: {
          message: 'Server has been initiated.'
        }
      },
      grunt: {
        options: {
          message: 'Gruntfile has been updated.'
        }
      },
      jade: {
        options: {
          message: 'Jade files has been compiled.'
        }
      },
      sass: {
        options: {
          message: 'Sass files has been compiled.'
        }
      }
    },

    watch: {
      options: {
        livereload: true,
        dateFormat: function (time) {
          grunt.log.writeln('Grunt has finished compiling in ' + time + 'ms!');
          grunt.log.writeln('Awaiting...');
          grunt.log.write('\x07'); // beep!
        },
        event: ['all']
      },

      configFiles: {
        files: ['Gruntfile.js'],
        tasks: ['notify:grunt'],
        options: {
          reload: true
        }
      },

      sass: {
        files: '<%= project.assets %>/sass/{,*/,*/*/}*.{scss,sass}',
        tasks: ['sass:dev', 'postcss:dev', 'notify:sass'],
      },

      jade: {
        files: '{,*/,*/*/,*/*/*/}*.jade',
        tasks: ['jade:dist', 'wiredep', 'notify:jade'],
      }
    }
  });

  grunt.registerTask('dist', ['jade', 'wiredep', 'sass', 'postcss']);
  grunt.registerTask('default', ['connect:server', 'notify:server', 'watch']);
};
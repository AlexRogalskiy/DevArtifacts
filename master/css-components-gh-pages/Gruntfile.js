//
// Start modules
// ======================================= 
module.exports = function( grunt ) {


// Grunt Time
// ---------------------------------
require('time-grunt')(grunt);

// Load all tasks
// ---------------------------------
require('jit-grunt')(grunt);

// Paths
// ---------------------------------
var PathConfig = {
  dev: 'dev',
  dist: '',
  build: 'build'
};

// Grunt config
// ---------------------------------
grunt.initConfig({

  // Config path
  config: PathConfig,

  // Clean files
  clean: { 
    build: {
      src: ['<%= config.build %>/']
    },
    cleanzip: {
      src: [
        '<%= config.build %>/**/stylus/',
        '!<%= config.build %>/*.zip'
      ]
    }
  },

  // Copy files
  copy: { 
    build: {
      files: [
        {
          expand: true,
          flatten: true,
          src: [ 
            '<%= config.dev %>/**/variables.styl',
            '<%= config.dev %>/**/helpers.styl',
            '<%= config.dev %>/**/carousel.styl'
          ],
          dest: '<%= config.build %>/carousel/stylus/',
          filter: 'isFile'
        },
        {
          expand: true,
          flatten: true,
          src: [ 
            '<%= config.dev %>/**/variables.styl',
            '<%= config.dev %>/**/helpers.styl',
            '<%= config.dev %>/**/collapse.styl'
          ],
          dest: '<%= config.build %>/collapse/stylus/',
          filter: 'isFile'
        },
        {
          expand: true,
          flatten: true,
          src: [ 
            '<%= config.dev %>/**/variables.styl',
            '<%= config.dev %>/**/helpers.styl',
            '<%= config.dev %>/**/dropdown.styl'
          ],
          dest: '<%= config.build %>/dropdown/stylus/',
          filter: 'isFile'
        },
        {
          expand: true,
          flatten: true,
          src: [ 
            '<%= config.dev %>/**/variables.styl',
            '<%= config.dev %>/**/helpers.styl',
            '<%= config.dev %>/**/modal.styl'
          ],
          dest: '<%= config.build %>/modal/stylus/',
          filter: 'isFile'
        },
        {
          expand: true,
          flatten: true,
          src: [ 
            '<%= config.dev %>/**/variables.styl',
            '<%= config.dev %>/**/helpers.styl',
            '<%= config.dev %>/**/tab.styl'
          ],
          dest: '<%= config.build %>/tab/stylus/',
          filter: 'isFile'
        },
        {
          expand: true,
          flatten: true,
          src: [ 
            '<%= config.dev %>/**/variables.styl',
            '<%= config.dev %>/**/helpers.styl',
            '<%= config.dev %>/**/tooltip.styl'
          ],
          dest: '<%= config.build %>/tooltip/stylus/',
          filter: 'isFile'
        }
      ]
    },
  },

  // Stylus
  stylus: {
    dist: {
      options: {
        compress: true
      },
      files: {
        '<%= config.dist %>/assets/css/style.css': '<%= config.dev %>/stylus/style.styl'
      }
    },
    build: {
      files: {
        '<%= config.build %>/carousel/carousel.css': '<%= config.dev %>/**/_carousel-style.styl',
        '<%= config.build %>/collapse/collapse.css': '<%= config.dev %>/**/_collapse-style.styl',
        '<%= config.build %>/dropdown/dropdown.css': '<%= config.dev %>/**/_dropdown-style.styl',
        '<%= config.build %>/modal/modal.css': '<%= config.dev %>/**/_modal-style.styl',
        '<%= config.build %>/tab/tab.css': '<%= config.dev %>/**/_tab-style.styl',
        '<%= config.build %>/tooltip/tooltip.css': '<%= config.dev %>/**/_tooltip-style.styl'
      }
    },
    dev: {
      files: {
        '<%= config.dev %>/assets/css/style.css': '<%= config.dev %>/stylus/style.styl'
      }
    }
  },

  // HTMLmin
  htmlmin: {
    dist: {
      options: {
        removeComments: true,
        collapseWhitespace: true
      },
      files: [{
        expand: true,
        cwd: '<%= config.dev %>/',
        src: ['*.html','**/*.html'],
        dest: '<%= config.dist %>',
      }],
    }
  },

  // Watch
  watch : {
    options: {
        debounceDelay: 500,
        livereload: true
    },
    styl: {
      files : [
        '<%= config.dev %>/**/*.styl'
      ],
      tasks : ['stylus:dev']
    }
  },

  // Sync
  browserSync: {
    bsFiles: {
      src : [
        '<%= config.dev %>/**/*.css',
        '<%= config.dev %>/**/*.jpg',
        '<%= config.dev %>/**/*.png',
        '<%= config.dev %>/**/*.js',
        '<%= config.dev %>/*.html'
      ]
    },
    options: {
      watchTask: true,
      host : '',
      server: {
        baseDir: '<%= config.dev %>/'
      },
      ghostMode: {
        scroll: true,
        links: true,
        forms: true
      }
    }
  },

  // Make a Zipfile
  compress: {
    carousel: {
      options: {
        archive: '<%= config.build %>/carousel.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: ['carousel/**']
        }
      ]
    },
    collapse: {
      options: {
        archive: '<%= config.build %>/collapse.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: ['collapse/**']
        }
      ]
    },
    dropdown: {
      options: {
        archive: '<%= config.build %>/dropdown.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: ['dropdown/**']
        }
      ]
    },
    modal: {
      options: {
        archive: '<%= config.build %>/modal.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: ['modal/**']
        }
      ]
    },
    tab: {
      options: {
        archive: '<%= config.build %>/tab.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: ['tab/**']
        }
      ]
    },
    tooltip: {
      options: {
        archive: '<%= config.build %>/tooltip.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: ['tooltip/**']
        }
      ]
    },
    all: {
      options: {
        archive: '<%= config.build %>/css-components.zip'
      },
      files: [
        {
          expand: true,
          cwd: '<%= config.build %>/',
          src: [
            'carousel/**',
            'collapse/**',
            'dropdown/**',
            'modal/**',
            'tab/**',
            'tooltip/**'
          ]
        }
      ]
    }
  }

});

// JsLint
grunt.registerTask( 'test', ['jshint'] );

// Dist
grunt.registerTask( 'dist', ['stylus:dist', 'htmlmin:dist'] );

// Build
grunt.registerTask( 'build', ['clean:build', 'copy:build', 'stylus:build', 'compress', 'clean:cleanzip'] );

// Watch
grunt.registerTask( 'w', ['browserSync', 'watch' ] );


};
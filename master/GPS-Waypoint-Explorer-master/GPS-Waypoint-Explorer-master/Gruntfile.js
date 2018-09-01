module.exports = function(grunt){
  grunt.initConfig({

    // Builds Sass
    sass: {
      dev: {
        options: {
          style: "expanded",
          sourcemap: true,
          includePaths: ['node_modules/bootstrap-sass/assets/stylesheets'],
          outputStyle: 'expanded'
        },
        files: [{
          expand: true,
          cwd: "app/assets/sass",
          src: ["*.scss"],
          dest: "public/stylesheets/",
          ext: ".css"
        }]
      }
    },

    // Copies templates and assets from external modules and dirs
    sync: {
      assets: {
        files: [{
          expand: true,
          cwd: 'app/assets/',
          src: ['**/*', '!sass/**'],
          dest: 'public/'
        }],
        ignoreInDest: "**/stylesheets/**",
        updateAndDelete: true
      },
      bootstrap: {
        files: [{
          cwd: 'node_modules/bootstrap-sass/assets/javascripts/',
          src: 'bootstrap.min.js',
          dest: 'public/javascripts'
        }]
      }
    },

    // Watches assets and sass for changes
    watch: {
      css: {
        files: ['app/assets/sass/**/*.scss'],
        tasks: ['sass'],
        options: {
          spawn: false,
        }
      },
      assets:{
        files: ['app/assets/**/*', '!app/assets/sass/**'],
        tasks: ['sync:assets'],
        options: {
          spawn: false,
        }
      }
    },

    // nodemon watches for changes and restarts app
    nodemon: {
      dev: {
        script: 'server.js',
        options: {
          ext: 'js, json',
          ignore: ['node_modules/**', 'app/assets/**', 'public/**'],
          args: grunt.option.flags()
        }
      }
    },

    concurrent: {
      target: {
        tasks: ['watch', 'nodemon'],
        options: {
          logConcurrentOutput: true
        }
      }
    }
  });

  [
    'grunt-sync',
    'grunt-contrib-watch',
    'grunt-sass',
    'grunt-nodemon',
    'grunt-concurrent'
  ].forEach(function (task) {
    grunt.loadNpmTasks(task);
  });

  grunt.registerTask('generate-assets', [
    'sync',
    'sass'
  ]);

  grunt.registerTask('default', [
    'generate-assets',
    'concurrent:target'
  ]);

  grunt.registerTask(
    'test',
    'default',
    function () {
      grunt.log.writeln('Test that the app runs');
    }
  );
};

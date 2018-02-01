'use strict';
module.exports = function(grunt){


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
      'public/assets/app.js': [
        'bower_components/jquery/dist/jquery.js',
        'javascripts/form.js'
      ]
  });
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.config('cssmin', {
    'public/assets/app.css': ['stylesheets/*.css']
  });
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    js: {
      files: ['gruntfile.js', 'javascripts/*.js'],
      tasks: ['uglify' ]
    },
    css: {
      files: ['stylesheets/*.css'],
      tasks: ['cssmin' ]
    }
  });


  grunt.config('servers', grunt.file.readJSON('servers.json'));

  grunt.loadNpmTasks('grunt-scp');
  grunt.config('scp', {
    production: {
      options: {
        host: '<%= servers.production.host %>',
        username: '<%= servers.production.username %>',
        password: '<%= servers.production.password %>'
      },
      files: [{
        cwd: 'public',
        src: '**/*',
        filter: 'isFile',
        dest: '/var/www/html'
      }]
    }
  });

  grunt.registerTask('build', ['cssmin', 'uglify']);

  grunt.registerTask('deploy', ['build', 'scp']);

};




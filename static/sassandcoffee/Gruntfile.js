'use strict';
module.exports = function(grunt){


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.config('uglify', {
      'public/assets/app.js': [
        'bower_components/jquery/dist/jquery.js',
        'tmp/app.js'
      ]
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.config('cssmin', {
    'public/assets/app.css': ['tmp/app.css']
  });
//
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.config('watch', {
    js: {
      files: ['coffeescripts/*.coffee'],
      tasks: ['coffee', 'uglify' ]
    },
    css: {
      files: ['sass/*.scss'],
      tasks: ['sass', 'cssmin' ]
    }
  });

  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.config('coffee', {
      'tmp/app.js': ['coffeescripts/*.coffee']
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.config('sass', {
    'tmp/app.css': ['sass/*.scss']
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
        dest: '/var/www'
      }]
    }
  });

  grunt.registerTask('build', ['coffee', 'sass', 'cssmin', 'uglify']);

  grunt.registerTask('deploy', ['build', 'scp']);

};




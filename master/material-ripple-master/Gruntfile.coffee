'use strict'

module.exports = (grunt) ->

  require('time-grunt')(grunt)
  require('jit-grunt')(grunt)

  grunt.initConfig
    pkg: grunt.file.readJSON('package.json')

    # Sass Task
    sass:
      options:
        style: 'expanded'
        precision: 10
        update: true

      dist:
        options:
          sourcemap: false
        expand: true
        cwd: 'src/scss'
        src: ['*.{scss,sass}', '!_*.{scss,sass}']
        dest: 'dist/css'
        ext: '.css'

    # CSSComb Task
    csscomb:
      dist:
        options:
          config: 'src/.csscomb.json'
        expand: true
        cwd: 'dist/css'
        src: ['*.css', '!*.min.css', '!*.map']
        dest: 'dist/css'
        ext: '.css'

    # PostCSS Task
    postcss:
      dist:
        options:
          map: true
          processors: [
            require('autoprefixer')({
              browsers: [
                'last 10 versions',
                'ie 11',
                'ie 10',
                'ie 9',
                'ie 8']
            })
          ]
        src: ['dist/**/*.css']

    # CSSmin Task
    cssmin:
      dist:
        options:
          sourcemap: false
        expand: true
        cwd: 'dist/css'
        src: ['*.css', '!*.map']
        dest: 'dist/css'
        ext: '.min.css'



    # Coffee Task
    coffee:
      dev:
        expand: true
        base: true
        cwd: 'src/coffee'
        src: ['*.coffee']
        dest: 'dist/js'
        ext: '.js'

    # Coffeelint Task
    coffeelint:
      options:
        configFile: 'src/.coffeelint.json'

      dev:
        files:
          src: ['src/**/*.coffee', 'Gruntfile.coffee']

    # Watch Task
    watch:
      options:
        livereload: true
        dateFormat: (time) ->
          grunt.log.writeln('Grunt has finished in ' + time + 'ms!')
          grunt.log.writeln('Waiting...')
        event: ['all']
        interrupt: true

      configFiles:
        files: ['Gruntfile.coffee']
        tasks: ['coffeelint']
        options:
          reload: true

      sass:
        files: '**/*.{scss,sass}'
        tasks: ['sass', 'csscomb', 'postcss', 'cssmin']

      coffee:
        files: ['**/*.coffee']
        tasks: ['coffee:dev', 'coffeelint']

  # Default Task
  grunt.registerTask 'default', [
    'sass'
    'csscomb'
    'postcss'
    'cssmin'
    'coffee'
    'coffeelint'
    'watch'
  ]
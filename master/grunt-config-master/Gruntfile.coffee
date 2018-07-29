'use strict'

module.exports = (grunt) ->
  path = require('path')

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'config')
    init: true
    data:
      basePath: 'grunt'
      srcPath: 'src'
      buildPath: '.build'
      assetsPath: '<%= buildPath %>/assets'
  })

  require('time-grunt')(grunt)

  grunt.file.setBase('../')
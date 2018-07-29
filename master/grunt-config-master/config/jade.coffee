module.exports =
  dev:
    options:
      pretty: true
      data: (dest, src) ->
        require('../../src/jade/config.json')
    expand: true
    cwd: '<%= srcPath %>/jade/views'
    src: ['**/*.jade']
    dest: '<%= buildPath %>'
    ext: '.html'
module.exports =
  options:
    configFile: '<%= basePath %>/coffeelint.json'

  files:
    src: [
      '<%= srcPath %>/**/*.coffee'
      'Gruntfile.coffee'
    ]
module.exports =
  options:
    config: '<%= basePath %>/csscomb.json'

  dev:
    expand: true
    cwd: '<%= assetsPath %>/css'
    src: [
      '*.css'
      '!*.min.css'
      '!*.map'
    ]
    dest: '<%= assetsPath %>/css'
    ext: '.css'
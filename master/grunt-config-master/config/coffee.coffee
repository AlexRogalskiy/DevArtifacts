module.exports =
  dev:
    expand: true
    base: true
    cwd: '<%= srcPath %>/coffee'
    src: ['*.coffee']
    dest: '<%= assetsPath %>/js'
    ext: '.js'
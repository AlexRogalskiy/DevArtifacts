module.exports =
  img:
    expand: true
    cwd: '<%= srcPath %>/img'
    src: ['**']
    dest: '<%= assetsPath %>/img'
    flatten: true

  font:
    expand: true
    cwd: '<%= srcPath %>/font'
    src: ['**']
    dest: '<%= assetsPath %>/font'
    flatten: true

  css:
    expand: true
    cwd: '<%= srcPath %>/css'
    src: ['**']
    dest: '<%= assetsPath %>/css'
    flatten: true

  js:
    expand: true
    cwd: '<%= srcPath %>/js'
    src: ['**']
    dest: '<%= assetsPath %>/js'
    flatten: true

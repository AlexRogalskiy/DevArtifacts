module.exports =
  options:
    sourcemap: true

  dev:
    expand: true
    cwd: '<%= assetsPath %>/css'
    src: ['*.css', '!*.map']
    dest: '<%= assetsPath %>/css'
    ext: '.min.css'
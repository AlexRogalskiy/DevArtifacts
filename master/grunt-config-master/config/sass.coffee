module.exports =
  options:
    precision: 10
    style: 'expanded'
    update: true
    cacheLocation: '<%= buildPath %>/.sass-cache'

  dev:
    expand: true
    cwd: '<%= srcPath %>/scss'
    src: [
      '*.{scss,sass}'
      '!_*.{scss,sass}'
    ]
    dest: '<%= assetsPath %>/css/'
    ext: '.css'
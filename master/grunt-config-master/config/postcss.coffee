module.exports =
  options:
    map: true
    processors: [
      require('autoprefixer')({
        browsers: [
          'last 10 versions'
          'ie 11'
          'ie 10'
          'ie 9'
          'ie 8'
        ]
      })
    ]

  dev:
    src: ['<%= assetsPath %>/**/*.css']
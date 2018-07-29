module.exports = (options) ->
  server:
    options:
      port: 3000
      base: ['.build', 'data']
      livereload: true
      # open:
        # target: 'http://localhost:3000'
        # appName: 'Google Chrome'
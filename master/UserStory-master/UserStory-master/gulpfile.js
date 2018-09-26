var gulp = require('gulp');
var gUtil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserfiy = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');

gulp.task('default', [], function () {
  var bundler = watchify(browserfiy({
    entries: ['./public/app/app.jsx'],
    transform: [reactify],
    extensions: ['.jsx'],
    debug: true,
    cache: {},
    packageCache: {},
    fullPaths: true
  }));

  function build(file) {
    if (file) {
      gUtil.log('Recompiling ' + file);
    }

    return bundler
      .bundle()
      .on('error', gUtil.log.bind(gUtil, 'Browserify Error'))
      .pipe(source('main.js'))
      .pipe(gulp.dest('./public'))
  }

  build();
  bundler.on('update', build);

});



var gulp = require('gulp');

var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');


gulp.task('styles', function() {
  return gulp.src('app/assets/style.scss')
    .pipe(sass({ style: 'compressed' }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('public/assets/css/'))
});
 

gulp.task('watch', function() {
  // Watch .scss files
  gulp.watch('sass/**/*.scss', ['styles']);
});

gulp.task('default', function() {
	gulp.start('styles');
});
'use strict';

var gulp = require('gulp');
var jshint = require('gulp-jshint');
var sass = require('gulp-sass');

gulp.task('jshint', function () {
  return gulp.src('./js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('sass', function () {
  return gulp.src('./sass/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./css'));
});

gulp.task('watch', function () {
  gulp.watch('./js/**/*.js', ['lint']);
  gulp.watch('./sass/**/*.scss', ['sass']);
});

gulp.task('default', ['sass']);

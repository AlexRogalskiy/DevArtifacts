# Gulp RequireJS optimize

Used to create `pkgd` files for [Masonry](http://masonry.desandro.com), [Isotope](http://isotope.metafizzy.co), [Packery](http://packery.metafizzy.co), and [Flickity](http://flickity.metafizzy.co).

``` js
var rjsOptimize = require('gulp-requirejs-optimize');

gulp.task( 'requirejs', function() {
  return gulp.src('js/packery.js')
    .pipe( rjsOptimize({
      baseUrl: 'bower_components',
      optimize: 'none',
      include: [
        'jquery-bridget/jquery-bridget',
        'packery/packery'
      ],
      paths: {
        packery: '../js/',
        jquery: 'empty:'
      }
    }) )
    .pipe( gulp.dest('dist') );
});
```

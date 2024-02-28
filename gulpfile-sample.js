const gulp = require('gulp');
const bookmarklet = require('gulp-bookmarklet');

gulp.task('build', (done) => {
  gulp.src(['src/**/*.js'])
    .pipe(bookmarklet())
    .pipe(gulp.dest('dist/'));

  done();
});

gulp.task('dev', (done) => {
  gulp.src(['src/**/*.js'])
    .pipe(bookmarklet({
      scheme: false,
      minify: false,
    }))
    .pipe(gulp.dest('dist/'));

  done();
});

gulp.task('watch', function() {
  gulp.watch('src/**.js', gulp.task('dev'));
});

gulp.task('default', gulp.series('watch'));

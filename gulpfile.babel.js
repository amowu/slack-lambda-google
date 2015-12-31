import del from 'del'
import gulp from 'gulp'
import gutil from 'gulp-util'
import zip from 'gulp-zip'
import runSequence from 'run-sequence'
import webpack from 'webpack'

gulp.task('clean', () => {
  return del('dist')
})

gulp.task('webpack', done => {
  webpack(require('./webpack.config.js'), (error) => {
    if(error) throw new gutil.PluginError('webpack', error)
    done()
  })
})

gulp.task('zip', () => {
  return gulp.src('dist/*')
    .pipe(zip('index.zip'))
    .pipe(gulp.dest('dist'))
})

gulp.task('build', done => {
  runSequence('clean', 'webpack', 'zip', done)
})

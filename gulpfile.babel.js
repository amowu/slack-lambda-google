import del from 'del'
import gulp from 'gulp'
import lambda from 'gulp-awslambda'
import gutil from 'gulp-util'
import zip from 'gulp-zip'
import runSequence from 'run-sequence'
import webpack from 'webpack'

import config from './config.json'

gulp.task('clean', () => del('dist'))

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

gulp.task('build', done =>
  runSequence('clean', 'webpack', 'zip', done)
)

gulp.task('default', ['build'], () =>
  gulp.src('dist/index.zip')
    .pipe(lambda({
      FunctionName: config.AWS.LAMBDA_FUNCTION_NAME,
      Handler: config.AWS.LAMBDA_HANDLER,
      MemorySize: config.AWS.LAMBDA_MEMORY_SIZE,
      Role: `arn:aws:iam::${config.AWS.ACCOUNT_ID}:role/lambda_basic_execution`,
      Runtime: 'nodejs',
      Timeout: config.AWS.LAMBDA_TIMEOUT
    },{
      region: config.AWS.LAMBDA_REGION
    }))
)

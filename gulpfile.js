import gulp from 'gulp'
import browserSync from 'browser-sync'
import build from './scripts/build'

const paths = {
  src: 'src/**/*',
  layouts: 'layouts/**/*',
}

let serverStarted = false

function refreshServer() {
  if (!serverStarted) {
    browserSync({
      server: {
        baseDir: './build',
      },
    })
    serverStarted = true
  } else {
    browserSync.reload()
  }
}

gulp.task('build', function buildTask(cb) {
  build({production: true}, function buildCompleted(err) {
    if (err) throw err
    cb()
  })
})

gulp.task('dev-build', function devBuildTask(cb) {
  build({production: false}, function buildCompleted(err) {
    if (err) throw err
    refreshServer()
    cb()
  })
})

gulp.task('watch', ['dev-build'], function watchTask(cb) {
  gulp.watch(paths.src, ['dev-build'])
  return gulp.watch(paths.layouts, ['dev-build'])
})

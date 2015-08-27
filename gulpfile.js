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
    browserSync({server: {baseDir: './build'}})
    serverStarted = true
  } else {
    browserSync.reload()
  }
}

gulp.task('build', cb => {
  build({production: true}, err => {
    if (err) throw err
    cb()
  })
})

gulp.task('dev-build', cb => {
  build({production: false}, err => {
    if (err) throw err
    refreshServer()
    cb()
  })
})

gulp.task('watch', ['dev-build'], cb => {
  gulp.watch(paths.src, ['dev-build'])
  return gulp.watch(paths.layouts, ['dev-build'])
})

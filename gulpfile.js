const gulp = require('gulp')
const browserSync = require('browser-sync')
const build = require('./scripts/build')

const paths = {
  src: 'src/**/*',
  layouts: 'layouts/**/*',
}

let serverStarted = false

function refresh(cb) {
  return (...args) => {
    if (!serverStarted) {
      browserSync({server: {baseDir: './build'}})
      serverStarted = true
    } else {
      browserSync.reload()
    }
    cb(...args)
  }
}

gulp.task('build', cb => {
  build({production: true}, cb)
})

gulp.task('dev-build', cb => {
  build({production: false}, refresh(cb))
})

gulp.task('watch', ['dev-build'], cb => {
  gulp.watch(paths.src, ['dev-build'])
  gulp.watch(paths.layouts, ['dev-build'])
})

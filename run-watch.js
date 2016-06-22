import gulp from 'gulp'
import browserSync from 'browser-sync'
import build from './scripts/build'

const options = {
  srcDir: "./",
  buildDir: "./build",
  production: false,
}

const paths = {
  src: 'src/**/*',
  layouts: 'layouts/**/*',
}

let serverStarted = false

function refresh(err) {
  if (err) console.error(err)

  if (!serverStarted) {
    browserSync({server: {baseDir: './build'}})
    serverStarted = true
  } else {
    browserSync.reload()
  }
}

function buildDev() {
  build(options, refresh)
}

gulp.watch(paths.src, buildDev)
gulp.watch(paths.layouts, buildDev)

buildDev()

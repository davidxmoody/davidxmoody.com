import gulp from 'gulp'
import browserSync from 'browser-sync'
import build from './scripts/build'
import gitlog from 'gitlog'

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

const options = {
  repo: __dirname,
  number: 1000000,
  author: 'David Moody',
  fields: [
    'authorName',
    'subject',
    'authorDate',
  ],
}

function makeDate({authorDate}) {
  // Fixes bug where merge commits have "@end@" on the end and they don't parse
  return new Date(authorDate.replace(/@end@$/, ''))
}

gulp.task('gitlog', cb => {
  gitlog(options, (err, commits) => {
    if (err) return cb(err)
    const dates = commits.map(makeDate)
    console.log(dates)
    cb()
  })
})

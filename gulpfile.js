import gulp from 'gulp'
import browserSync from 'browser-sync'
import build from './scripts/build'
import gitlog from 'gitlog'
import glob from 'glob'
import path from 'path'

const gitAuthorName = 'David Moody'

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

function makeDate({authorDate}) {
  // Fixes bug where merge commits have "@end@" on the end and they don't parse
  return new Date(authorDate.replace(/@end@$/, ''))
}

function discoverRepos(searchPaths) {
  return searchPaths.map(
    searchPath => {
      return glob.sync('*/.git', {
        cwd: path.join(process.env.HOME, searchPath),
        realpath: true,
      }).map(str => str.replace(/\/.git$/, ''))
    }
  ).reduce((a, b) => a.concat(b), []).map(
    fullPath => ({
      fullPath,
      name: fullPath.replace(/^.*\//, ''),
    })
  )
}

function getCommits(repo) {
  return new Promise((resolve, reject) => {
    const options = {
      repo: repo.fullPath,
      number: 1000000,
      author: gitAuthorName,
      fields: [
        'authorName',
        'subject',
        'authorDate',
      ],
    }

    gitlog(options, (err, commits) => {
      if (err) {
        reject(err)
      } else {
        resolve(commits.map(commit => ({
          repoName: repo.name,
          date: makeDate(commit),
          subject: commit.subject,
        })))
      }
    })
  })
}

function getAllCommits(searchPaths) {
  return Promise.all(
    discoverRepos(searchPaths).map(getCommits)
  ).then(
    commitLists => commitLists.reduce((a, b) => a.concat(b), [])
  )
}

function toYYYYMMDD(date) {
  return date.toISOString().slice(0, 10)
}

function groupCommitsByDay(commits) {
  const days = {}

  for (const commit of commits) {
    const day = toYYYYMMDD(commit.date)
    if (!days[day]) days[day] = []
    days[day].push(commit)
  }

  const sortedKeys = Object.keys(days).sort()
  const firstDay = sortedKeys[0]
  const lastDay = sortedKeys[sortedKeys.length - 1]

  for (let d = new Date(firstDay); d < new Date(lastDay); d.setDate(d.getDate() + 1)) {
    const dayInRange = toYYYYMMDD(d)
    if (!days[dayInRange]) {
      days[dayInRange] = []
    }
  }

  // For convenience and readability, sort the object by date
  const sortedDays = {}
  for (const day of Object.keys(days).sort()) {
    sortedDays[day] = days[day]
  }

  return sortedDays
}

gulp.task('gitlog', cb => {
  getAllCommits(['p', 'sync/old-projects']).then(commits => {
    const days = groupCommitsByDay(commits)
    console.log(days)
    cb()
  }).catch(
    err => cb(err)
  )
})

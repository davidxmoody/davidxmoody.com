/* eslint-disable no-unused-vars */
const gulp = require("gulp")
const browserSync = require("browser-sync")
const build = require("./scripts/build")
const nunjucks = require("nunjucks")

let serverStarted = false

function refresh(cb) {
  return (...args) => {
    if (!serverStarted) {
      browserSync({
        notify: false,
        server: {baseDir: "./build"},
      })
      serverStarted = true
    } else {
      browserSync.reload()
    }
    cb(...args)
  }
}

gulp.task("build", (cb) => {
  build({production: true}, cb)
})

gulp.task("dev-build", (cb) => {
  build({production: false}, refresh(cb))
})

gulp.task("watch", gulp.series("dev-build", (cb) => {
  nunjucks.configure({watch: true})
  gulp.watch("{src, layouts}/**/*", gulp.parallel("dev-build"))
}))

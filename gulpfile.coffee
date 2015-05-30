gulp = require "gulp"
browserSync = require "browser-sync"
build = require "./scripts/build"

paths =
  src: "src/**/*"
  layouts: "layouts/**/*"

startServer = ->
  browserSync
    server:
      baseDir: "./build"

refreshServer = ->
  browserSync.reload()


gulp.task "browser-sync", ->
  startServer()

gulp.task "dev-build", ->
  build (err) ->
    if err then throw err
    refreshServer()

gulp.task "watch", ["browser-sync", "dev-build"], ->
  gulp.watch(paths.src, ["dev-build"])
  gulp.watch(paths.layouts, ["dev-build"])

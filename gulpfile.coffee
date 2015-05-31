gulp = require "gulp"
browserSync = require "browser-sync"
build = require "./scripts/build"

paths =
  src: "src/**/*"
  layouts: "layouts/**/*"

serverStarted = false

refreshServer = ->
  if not serverStarted
    browserSync
      server:
        baseDir: "./build"
    serverStarted = true
  else
    browserSync.reload()


gulp.task "build", ->
  build {production: true}, (err) ->
    if err then throw err
    console.log "Built successfully"

gulp.task "dev-build", ->
  build {production: false}, (err) ->
    if err then throw err
    refreshServer()

gulp.task "watch", ["dev-build"], ->
  gulp.watch(paths.src, ["dev-build"])
  gulp.watch(paths.layouts, ["dev-build"])

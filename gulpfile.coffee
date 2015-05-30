gulp = require "gulp"
build = require "./scripts/build"

paths =
  src: "src/**/*"
  layouts: "layouts/**/*"

gulp.task "build", ->
  build()

gulp.task "watch", ["build"], ->
  gulp.watch(paths.src, ["build"])
  gulp.watch(paths.layouts, ["build"])

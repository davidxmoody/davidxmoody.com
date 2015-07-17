import 'coffee-script/register';
import 'coffee-react/register';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import build from './scripts/build.coffee';

let paths = {
  src: 'src/**/*',
  layouts: 'layouts/**/*'
};

let serverStarted = false;

let refreshServer = function() {
  if (!serverStarted) {
    browserSync({
      server: {
        baseDir: './build'
      }
    });
    serverStarted = true;
  } else {
    browserSync.reload();
  }
};

gulp.task('build', function(cb) {
  build({production: true}, function(err) {
    if (err) { throw err; }
    console.log('Built successfully');
    cb()
  });
});

gulp.task('dev-build', function(cb) {
  build({production: false}, function(err) {
    if (err) { throw err; }
    refreshServer();
    cb()
  });
});

gulp.task('watch', ['dev-build'], function(cb) {
  gulp.watch(paths.src, ['dev-build']);
  gulp.watch(paths.layouts, ['dev-build']);
});

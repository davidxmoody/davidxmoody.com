import 'coffee-script/register';
import 'coffee-react/register';
import gulp from 'gulp';
import browserSync from 'browser-sync';
import build from './scripts/build.babel.js';
import eslint from 'gulp-eslint';

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

gulp.task('lint', function() {
  //return gulp.src(['scripts/**/*.babel.js'])
  return gulp.src(['test.js'])
    .pipe(eslint({
      parser: 'babel-eslint',
    ecmaFeatures: {
      arrowFunctions: true,
      blockBindings: true,
      destructuring: true,
      regexYFlag: true,
      regexUFlag: true,
      templateStrings: true,
      binaryLiterals: true,
      octalLiterals: true,
      unicodeCodePointEscapes: true,
      defaultParams: true,
      restParams: true,
      forOf: true,
      objectLiteralComputedProperties: true,
      objectLiteralShorthandMethods: true,
      objectLiteralShorthandProperties: true,
      objectLiteralDuplicateProperties: true,
      generators: true,
      spread: true,
      classes: true,
      modules: true,
      jsx: true,
      globalReturn: true
    },
    tokens: true,
    loc: true,
    range: true,
    comment: true,
    attachComments: true
  }))
    .pipe(eslint.format());
    //.pipe(eslint.failOnError());
})

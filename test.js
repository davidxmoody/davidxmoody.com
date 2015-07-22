import build from './scripts/build';

build({production: true}, function buildCompleted(err) {
  if (err) { throw err; }
  console.log('Built successfully');
});

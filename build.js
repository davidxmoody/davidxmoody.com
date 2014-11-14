var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');

Metalsmith(__dirname)
  .metadata({
    title: "David Moody's Blog",
    description: "A blog about programming"
  })
  .clean(true)
  .use(markdown())
  .use(permalinks({
    pattern: ':title'
  }))
  .use(templates('mustache'))
  .build(function(err) {
    if (err) throw err;
    console.log("Finished");
  });

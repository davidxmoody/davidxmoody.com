var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');

Metalsmith(__dirname)
  .clean(true)
  .metadata({
    title: "David Moody's Blog",
    description: "A blog about programming"
  })

  .use(collections({
    posts: 'posts/*.md',
    pages: 'pages/*.md'
  }))
  .use(function(files, metalsmith, done) {
    // Set default templates
    metalsmith.metadata().posts.forEach(function(post) {
      post.template = 'post.html';
    });
    metalsmith.metadata().pages.forEach(function(page) {
      page.template = 'default.html';
    });
    Object.keys(files).forEach(function(file) {
      console.log(files[file].template, file);
    });
    done();
  })

  .use(markdown())
  .use(permalinks({
    pattern: ':title'
  }))
  .use(templates('mustache'))
  .build(function(err) {
    if (err) throw err;
    console.log("Finished");
  });

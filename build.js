var moment = require('moment');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var each = require('metalsmith-each');
var dateInFilename = require('metalsmith-date-in-filename');
var paginate = require('metalsmith-pagination');
var serve = require('metalsmith-serve');
var sass = require('metalsmith-sass');
var ignore = require('metalsmith-ignore');

Metalsmith(__dirname)
  .clean(true)
  .metadata({
    title: "David Moody's Blog",
    description: "A blog about programming"
  })

  .use(ignore([
        "css/_*.sass"
  ]))

  .use(dateInFilename())
  .use(each(function(file) {
    file.formattedDate = moment(file.date).format('ll');
  }))

  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))
  .use(function(files, metalsmith) {
    // Set default templates
    metalsmith.metadata().posts.forEach(function(post) {
      post.template = 'post.html';
    });
  })

  .use(markdown())
  .use(permalinks({
    pattern: ':title'
  }))

  .use(paginate({
    'collections.posts': {
      perPage: 5,
      template: 'list.html',
      first: 'index.html',
      path: 'page:num/index.html',
      pageMetadata: {
        title: 'All posts'
      }
    }
  }))

  .use(each(function(file, filename) {
    file.url = '/' + filename.replace(/index.html$/, '');
  }))

  // Use templates once then once again to wrap *every file* in default.html
  .use(templates('mustache'))
  .use(each(function(file) {
    file.template = 'default.html';
  }))
  .use(templates('mustache'))

  .use(sass())

  .use(serve())

  .build(function(err) {
    if (err) throw err;
    console.log("Finished");
  });

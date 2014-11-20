var moment = require('moment');
var Metalsmith = require('metalsmith');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var each = require('metalsmith-each');
var dateInFilename = require('metalsmith-date-in-filename');
var pagination = require('metalsmith-pagination');
var serve = require('metalsmith-serve');
var sass = require('metalsmith-sass');
var ignore = require('metalsmith-ignore');
var beautify = require('metalsmith-beautify');
var feed = require('metalsmith-feed');
var fingerprint = require('metalsmith-fingerprint');

var markdown = require('./markdown');
var excerpts = require('./excerpts');

var extname = require('path').extname;

var EXCERPT_SEPARATOR = '\n\n\n';

function isHTML(file){
  return /\.html/.test(extname(file));
}


Metalsmith(__dirname + '/..')
  .clean(true)
  //TODO tidy this up, remove duplicated stuff
  .metadata({
    title: "David Moody's Blog",
    description: "A blog about programming",
    site: {
      url: "http://davidxmoody.com",
      title: "David Moody's Blog"
    }
  })

  .use(dateInFilename())
  .use(each(function(file) {
    if (file.date) file.formattedDate = moment(file.date).format('ll');
  }))

  .use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true
    }
  }))

  // Replace custom excerpt separator with <!--more--> tag
  .use(function(files, metalsmith) {
    metalsmith.metadata().posts.forEach(function(file) {
      file.contents = new Buffer(file.contents.toString().replace(EXCERPT_SEPARATOR, '\n\n<!--more-->\n\n'));
    });
  })
    
  .use(markdown())

  .use(pagination({
    'collections.posts': {
      perPage: 6,
      template: 'list.html',
      first: 'index.html',
      path: 'page:num/index.html',
      pageMetadata: { }
    }
  }))
  // Don't include the first page (use the regular "/index.html" instead)
  .use(ignore(["page1/index.html"]))

  .use(permalinks({
    pattern: ':title/'
  }))
  .use(each(function(file, filename) {
    file.path = filename.replace(/index.html$/, '');
  }))

  .use(excerpts())

  .use(each(function(file, filename) {
    var pag = file.pagination;
    if (pag) {
      pag.previousHTML = pag.previous ? 
          '<a href="/' + pag.previous.path + '">&laquo;</a>' :
          '<span>&laquo;</span>';
      pag.nextHTML = pag.next ? 
          '|<a href="/' + pag.next.path + '">&raquo;</a>' :
          '|<span>&raquo;</span>';
      pag.pagesHTML = [];
      pag.pages.forEach(function(page) {
        pag.pagesHTML.push( file === page ?
          '|<span>' + page.pagination.num + '</span>' :
          '|<a href="/' + page.path + '">' + page.pagination.num + '</a>');
      });
    }
  }))

  .use(sass())
  .use(fingerprint({
    pattern: 'css/main.css'
  }))
  .use(ignore([
        'css/_*.sass',
        'css/main.css'
  ]))

  // Use templates once then once again to wrap *every HTML file* in default.html
  .use(function(files, metalsmith) {
    metalsmith.metadata().posts.forEach(function(file) {
      file.template = 'post.html';
    });
  })
  .use(templates('handlebars'))
  .use(each(function(file, filename) {
    if (isHTML(filename)) file.template = 'default.html';
  }))
  .use(templates('handlebars'))

  .use(beautify({
    wrap_line_length: 79,
    indent_size: 2,
    indent_char: ' '
  }))

  .use(feed({
    collection: 'posts',
    limit: 10,
    destination: 'feed.xml'
  }))
  .use(function(files) {
    // Make all relative links and images into absolute links and images
    data = files['feed.xml'];
    data.contents = new Buffer(data.contents.toString().replace(/src="\//g, 'src="http://davidxmoody.com/').replace(/href="\//g, 'href="http://davidxmoody.com/'));
  })

  .use(serve())

  .build(function(err) {
    if (err) throw err;
    console.log("Finished");
  });

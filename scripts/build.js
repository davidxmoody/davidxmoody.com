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
var drafts = require('metalsmith-drafts');
var pdf = require('metalsmith-pdf');

var markdown = require('./markdown');
var excerpts = require('./excerpts');

var extname = require('path').extname;

var EXCERPT_SEPARATOR = '\n\n\n';

function isHTML(file){
  return /\.html/.test(extname(file));
}

var METADATA = {
  title: "David Moody's Blog",
  description: "A blog about programming",
  url: "http://davidxmoody.com",
  feedPath: "feed.xml",
  gitHubURL: "https://github.com/davidxmoody",
  email: "david@davidxmoody.com"
};


Metalsmith(__dirname + '/..')

  // CONFIG ===================================================================

  .clean(true)
  .metadata(METADATA)

  // POSTS ====================================================================

  //TODO Is there a better method for doing drafts? Maybe a drafts dir
  .use(drafts())

  // TODO decide on better method for post naming
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

  // Convert space separated string of tags into a list
  .use(each(function(file) {
    if (file.tags && typeof file.tags === 'string') {
      file.tags = file.tags.split(' ');
    }
  }))

  // Replace custom EXCERPT_SEPARATOR with <!--more--> tag
  .use(function(files, metalsmith) {
    metalsmith.metadata().posts.forEach(function(file) {
      file.contents = new Buffer(file.contents.toString().replace(EXCERPT_SEPARATOR, '\n\n<!--more-->\n\n'));
    });
  })
    
  .use(markdown())

  .use(permalinks({
    pattern: ':title/'
  }))

  // HOME PAGE PAGINATION =====================================================

  .use(pagination({
    'collections.posts': {
      perPage: 6,
      template: 'list.html',
      first: 'index.html',
      path: 'page:num/index.html',
      pageMetadata: {}
    }
  }))
  // Don't duplicate the first page
  .use(ignore(["page1/index.html"]))

  // Clean up paths to provide clean URLs
  .use(each(function(file, filename) {
    file.path = filename.replace(/index.html$/, '');
  }))

  // EXCERPTS =================================================================
  
  .use(excerpts())

  .use(each(function(file, filename) {
    var pag = file.pagination;
    if (pag) {
      var links = [];

      links.push(pag.previous ? 
          '<a href="/' + pag.previous.path + '">&laquo;</a>' :
          '<span>&laquo;</span>');

      pag.pages.forEach(function(page) {
        links.push(file === page ?
          '<span>' + page.pagination.num + '</span>' :
          '<a href="/' + page.path + '">' + page.pagination.num + '</a>');
      });

      links.push(pag.next ? 
          '<a href="/' + pag.next.path + '">&raquo;</a>' :
          '<span>&raquo;</span>');

      pag.linksHTML = '<p class="pagination">' + links.join('|') + '</p>';
    }
  }))

  // CSS AND FINGERPRINTING ===================================================

  .use(sass())
  .use(fingerprint({
    pattern: 'css/main.css'
  }))
  .use(ignore([
        'css/_*.sass',
        'css/main.css'
  ]))

  // TEMPLATES ================================================================

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

  // BEAUTIFY =================================================================

  // TODO is this necessary?
  .use(beautify({
    wrap_line_length: 79,
    indent_size: 2,
    indent_char: ' '
  }))

  // RSS FEED =================================================================

  .use(feed({
    collection: 'posts',
    limit: 20,
    destination: METADATA.feedPath,
    title: METADATA.title,
    site_url: METADATA.url,
    description: METADATA.description
  }))
  .use(function(files) {
    // Make all relative links and images into absolute links and images
    data = files[METADATA.feedPath];
    data.contents = new Buffer(data.contents.toString()
        .replace(/(src|href)="\//g, '$1="' + METADATA.url));
  })

  // CV PDF ===================================================================

  .use(pdf({
    pattern: 'cv/index.html',
    printMediaType: true,
    marginTop: '1.5cm',
    marginBottom: '1.5cm'
  }))

  // Rename CV to something more meaningful
  .use(function(files) {
    var oldPath = 'cv/index.pdf';
    var newPath = 'cv/david-moody-cv-web-developer.pdf';

    files[newPath] = files[oldPath];
    delete files[oldPath];
  })

  // SERVE AND BUILD ==========================================================

  .use(serve())
  .build(function(err) {
    if (err) throw err;
  });

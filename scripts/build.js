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
var marked = require('marked');
var basename = require('path').basename;
var dirname = require('path').dirname;
var extname = require('path').extname;

var EXCERPT_SEPARATOR = '\n\n\n';

function isMarkdown(file){
  return /\.md|\.markdown/.test(extname(file));
}

function isHTML(file){
  return /\.html/.test(extname(file));
}

function paraCount(text) {
  return text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length;
}

var markedOptions = {
  gfm: true,
  tables: true,
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      var str = result.toString();
      callback(err, str);
    });
  }
};

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
  .use(function(files, metalsmith, done) {
    var toProcess = [];

    Object.keys(files).forEach(function(file) {
      if (!isMarkdown(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = dir + '/' + html;

      var raw_str = data.contents.toString();

      toProcess.push(function(callback) {
        marked(raw_str, markedOptions, function(err, result) {
          //TODO is in necessary to create a new buffer?
          data.contents = new Buffer(result.toString());
          callback();
        });
      });

      //TODO check for being in not the first
      if (data.collection && data.collection[0] === 'posts') {
        var raw_excerpt = raw_str.split(EXCERPT_SEPARATOR, 2)[0];
        //console.log(raw_excerpt);
        toProcess.push(function(callback) {
          marked(raw_excerpt, markedOptions, function(err, results) {
            //console.log(results.toString());
            data.excerpt = results.toString();
            callback();
          });
        });
      }

      delete files[file];
      files[html] = data;
    });

    var numToProcess = toProcess.length;
    toProcess.forEach(function(func) {
      func(function() {
        numToProcess--;
        if (numToProcess === 0) {
          done();
        }
      });
    });

  })

  .use(function(files, metalsmith) {
    metalsmith.metadata().posts.forEach(function(file) {
      // Set default template
      file.template = 'post.html';

      // Paragraph counts
      var count = paraCount(file.contents.toString());
      var excerptCount = paraCount(file.excerpt);
      var remainingCount = count - excerptCount;

      if (remainingCount === 0) {
        file.readMoreText = "View post on separate page";
      } else if (remainingCount === 1) {
        file.readMoreText = "Read 1 remaining paragraph...";
      } else {
        file.readMoreText = "Read " + remainingCount + " remaining paragraphs...";
      }
    });
  })

  .use(permalinks({
    pattern: ':title'
  }))

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

  .use(each(function(file, filename) {
    file.url = '/' + filename.replace(/index.html$/, '');
  }))

  .use(each(function(file, filename) {
    var pag = file.pagination;
    if (pag) {
      pag.previousHTML = pag.previous ? 
          '<a href="' + pag.previous.url + '">&laquo;</a>' :
          '<span>&laquo;</span>';
      pag.nextHTML = pag.next ? 
          '|<a href="' + pag.next.url + '">&raquo;</a>' :
          '|<span>&raquo;</span>';
      pag.pagesHTML = [];
      pag.pages.forEach(function(page) {
        pag.pagesHTML.push( file === page ?
          '|<span>' + page.pagination.num + '</span>' :
          '|<a href="' + page.url + '">' + page.pagination.num + '</a>');
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

  //TODO this is duplicated and silly, change it
  .use(each(function(file, filename) {
    file.url = 'http://davidxmoody.com/' + filename.replace(/index.html$/, '');
    file.excerpt += '<p><a href="' + file.url + '">' + file.readMoreText + '</a></p>';
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

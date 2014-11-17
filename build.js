var moment = require('moment');
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var templates = require('metalsmith-templates');
var permalinks = require('metalsmith-permalinks');
var collections = require('metalsmith-collections');
var each = require('metalsmith-each');
var dateInFilename = require('metalsmith-date-in-filename');
var pagination = require('metalsmith-pagination');
var serve = require('metalsmith-serve');
var sass = require('metalsmith-sass');
var ignore = require('metalsmith-ignore');
var marked = require('marked');
var basename = require('path').basename;
var dirname = require('path').dirname;
var extname = require('path').extname;

EXCERPT_SEPARATOR = '\n\n\n';

function isMarkdown(file){
  return /\.md|\.markdown/.test(extname(file));
}

function isHTML(file){
  return /\.html/.test(extname(file));
}

var markedOptions = {
  gfm: true,
  tables: true,
  highlight: function (code, lang, callback) {
    //console.log(code,lang,callback);
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      var str = result.toString();
      //TODO fix the double pre element bug properly
      //str = str.replace(/^<div class="highlight"><pre>/, '<div class="highlight">');
      //str = str.replace(/<\/pre><\/div>\n$/, '</div>');
      callback(err, str);
    });
  }
};

Metalsmith(__dirname)
  .clean(true)
  .metadata({
    title: "David Moody's Blog",
    description: "A blog about programming"
  })

  .use(each(function(file, filename) {
    //console.log(filename);
  }))

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
          //console.log(data.contents.toString().substr(0, 20));
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
        //console.log("remaining:", numToProcess);
        if (numToProcess === 0) {
          done();
        }
      });
    });

  })

  .use(each(function(file, filename) {
    //console.log(file.collection);
    //TODO check for being in not the first
    if (file.collection[0] === 'posts') {
      file.template = 'post.html';

      function paraCount(text) {
        return text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length;
      }

      // Paragraph count
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
  //TODO put this in the template



      //if (filename === 'posts/2014-11-05-here-are-my-dotfiles.html') {
        //console.log(filename, count);
        //console.log(file.contents.toString().match(/<(p|ul|ol|pre)>[\s\S]*?<\/\1>/g));
      //}

    }
  }))

  //.use(markdown(markedOptions))
  .use(permalinks({
    pattern: ':title'
  }))

  .use(pagination({
    'collections.posts': {
      perPage: 8,
      template: 'list.html',
      first: 'index.html',
      path: 'page:num/index.html',
      pageMetadata: {
        title: 'All posts'
      }
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

  // Use templates once then once again to wrap *every HTML file* in default.html
  .use(templates('handlebars'))
  .use(each(function(file, filename) {
    if (isHTML(filename)) file.template = 'default.html';
  }))
  .use(templates('handlebars'))

  .use(sass())

  .use(serve())

  .build(function(err) {
    if (err) throw err;
    console.log("Finished");
  });

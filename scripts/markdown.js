var basename = require('path').basename;
var dirname = require('path').dirname;
var extname = require('path').extname;
var marked = require('marked');

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

module.exports = function(options) {
  return function(files, metadata, done) {
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
          data.contents = new Buffer(result.toString());
          callback();
        });
      });

      delete files[file];
      files[html] = data;
    });

    //TODO there's probably a better design pattern for this (promises?)
    var numToProcess = toProcess.length;
    toProcess.forEach(function(func) {
      func(function() {
        numToProcess--;
        if (numToProcess === 0) {
          done();
        }
      });
    });

  };
};

function isMarkdown(file){
  return /\.md|\.markdown/.test(extname(file));
}

module.exports = {
  gfm: true,
  tables: true,
  highlight: function (code, lang, callback) {
    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function (err, result) {
      var str = result.toString();
      callback(err, str);
    });
  }
};

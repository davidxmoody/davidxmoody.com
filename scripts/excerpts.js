module.exports = function(options) {
  options = options || {};
  options.excerptSeparator = options.excerptSeparator || /<!--\s*more\s*-->/;
  return function(files, metalsmith) {
    //TODO better way to filter
    metalsmith.metadata().posts.forEach(function(file) {
      //TODO add failure option for separator not found
      var parts = file.contents.toString().split(options.excerptSeparator, 2);
      var before = parts[0];
      var after = parts[1];

      var readMoreText;
      var remainingCount = paraCount(after);
      switch (remainingCount) {
        case 0:
          readMoreText = "View post on separate page";
          break;
        case 1:
          readMoreText = "Read 1 remaining paragraph...";
          break;
        default:
          readMoreText = "Read " + remainingCount + " remaining paragraphs...";
          break;
      }

      //TODO this is dependant on file.url, change that
      file.excerpt = before + '<p><a href="' + file.url + '">' + readMoreText + '</a></p>';
    });
  };
};

function paraCount(text) {
  return text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length;
}

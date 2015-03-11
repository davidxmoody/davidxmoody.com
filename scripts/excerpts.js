module.exports = function(options) {
  options = options || {};
  options.excerptSeparator = options.excerptSeparator || /<!--\s*more\s*-->/;
  return function(files, metalsmith) {
    //TODO better way to filter
    metalsmith.metadata().posts.forEach(function(file) {
      var parts = file.contents.toString().split(options.excerptSeparator, 2);
      var before = parts[0];
      var after = parts[1];

      var remainingCount = after ? paraCount(after) : 0;
      var readMoreText;
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

      file.excerpt = before + '<p><a href="/' + file.path + '">' + readMoreText + '</a></p>';
    });
  };
};

function paraCount(text) {
  return text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length;
}

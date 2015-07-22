const EXCERPT_SEPARATOR = /<!--\s*more\s*-->/;

function paraCount(text) {
  return text ? text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length : 0;
}

export default function() {
  return function(files, metalsmith) {
    for (const file of metalsmith.metadata().posts) {
      const [before, after] = file.contents.toString().split(EXCERPT_SEPARATOR, 2);

      const remainingCount = paraCount(after);
      let readMoreText;
      switch (remainingCount) {
        case 0:
          readMoreText = 'View post on separate page';
          break;
        case 1:
          readMoreText = 'Read 1 remaining paragraph...';
          break;
        default:
          readMoreText = `Read ${remainingCount} remaining paragraphs...`;
      }

      file.excerpt = `${before} <p><a href="/${file.path}">${readMoreText}</a></p>`;
    }
  };
}

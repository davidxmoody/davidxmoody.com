const EXCERPT_SEPARATOR = /<!--\s*more\s*-->/

function paraCount(text) {
  return text ? text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length : 0
}

function getReadMoreText(text) {
  const remainingCount = paraCount(text)

  switch (remainingCount) {
  case 0:
    return 'View post on separate page'
  case 1:
    return 'Read 1 remaining paragraph...'
  default:
    return `Read ${remainingCount} remaining paragraphs...`
  }
}

export default function() {
  return function(files, metalsmith) {
    for (const file of metalsmith.metadata().posts) {
      const [before, after] = file.contents.toString().split(EXCERPT_SEPARATOR, 2)
      const readMoreText = getReadMoreText(after)
      file.excerpt = `${before} <p><a href="${file.relativeURL}">${readMoreText}</a></p>`
    }
  }
}

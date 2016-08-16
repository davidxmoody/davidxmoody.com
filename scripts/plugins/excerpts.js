const excerptSeparator = /<!--\s*more\s*-->/

function paraCount(text) {
  return text ? text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length : 0
}

function getReadMoreText(text) {
  const remainingCount = paraCount(text)

  if (remainingCount === 0) 
    return "View post on separate page"

  if (remainingCount === 1) 
    return "Read 1 remaining paragraph..."

  return `Read ${remainingCount} remaining paragraphs...`
}

module.exports = () => (files, metalsmith) => {
  for (const file of metalsmith.metadata().posts) {
    const [before, after] = file.contents.toString().split(excerptSeparator, 2)
    const readMoreText = getReadMoreText(after)
    file.excerpt = `${before} <p><a href="${file.relativeURL}">${readMoreText}</a></p>`
  }
}

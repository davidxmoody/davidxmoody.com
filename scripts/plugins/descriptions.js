const cheerio = require('cheerio')

const maxDescriptionLength = 155

function getDescription(html) {
  const $ = cheerio.load(html)
  let description = $('p')
    .map(function() { return $(this).text() })
    .get()
    .join(' ')
    .replace(/\s{2,}/, ' ')

  if (description.length > maxDescriptionLength) {
    description = description.slice(0, maxDescriptionLength - 3)
    description = description.replace(/[,.!?:;]?\s*\S*$/, '...')
  }

  return description
}

module.exports = () => (files, metalsmith) => {
  for (const file of metalsmith.metadata().posts) {
    if (!file.description) {
      file.description = getDescription(file.contents.toString())
    }
  }
}

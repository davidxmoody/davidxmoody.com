const marked = require("marked")
const {highlight} = require("highlight.js")

const markdownRegex = /\.(md|mkd|markdown)$/

const markedOptions = {
  gfm: true,
  highlight(code, lang) {
    return lang ? highlight(lang, code).value : code
  },
}

module.exports = () => files => {
  for (const filename in files) {
    if (markdownRegex.test(filename)) {
      const file = files[filename]
      const rawStr = file.contents.toString()
      const formatted = marked(rawStr, markedOptions)
      file.contents = new Buffer(formatted)

      const newFilename = filename.replace(markdownRegex, ".html")
      delete files[filename]
      files[newFilename] = file
    }
  }
}

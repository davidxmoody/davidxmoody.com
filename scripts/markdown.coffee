basename = require("path").basename
dirname = require("path").dirname
extname = require("path").extname
marked = require("marked")
{highlight} = require("highlight.js")

markdownRegex = /\.(md|mkd|markdown)$/

markedOptions =
  gfm: true
  highlight: (code, lang) ->
    if lang
      highlight(lang, code).value
    else
      code

module.exports = (options) ->
  (files, metadata) ->
    for filename, file of files
      if not markdownRegex.test(filename) then continue

      rawStr = file.contents.toString()
      formatted = marked rawStr, markedOptions
      file.contents = new Buffer formatted

      newFilename = filename.replace markdownRegex, ".html"
      delete files[filename]
      files[newFilename] = file

import marked from 'marked'
import {highlight} from 'highlight.js'

const MARKDOWN_REGEX = /\.(md|mkd|markdown)$/

const MARKED_OPTIONS = {
  gfm: true,

  highlight(code, lang) {
    if (lang) {
      return highlight(lang, code).value
    }

    return code
  },
}

export default function() {
  return function(files) {
    for (const filename in files) {
      if (MARKDOWN_REGEX.test(filename)) {
        const file = files[filename]
        const rawStr = file.contents.toString()
        const formatted = marked(rawStr, MARKED_OPTIONS)
        file.contents = new Buffer(formatted)

        const newFilename = filename.replace(MARKDOWN_REGEX, '.html')
        delete files[filename]
        files[newFilename] = file
      }
    }
  }
}

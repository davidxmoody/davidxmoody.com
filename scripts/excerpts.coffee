paraCount = (text) ->
  return 0 unless text
  text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length

module.exports = (options) ->

  options ?= {}
  options.excerptSeparator ?= /<!--\s*more\s*-->/

  (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      parts = file.contents.toString().split(options.excerptSeparator, 2)
      before = parts[0]
      after = parts[1]

      remainingCount = paraCount(after)
      readMoreText = switch remainingCount
        when 0
          "View post on separate page"
        when 1
          "Read 1 remaining paragraph..."
        else
          "Read #{remainingCount} remaining paragraphs..."

      file.excerpt = "#{before}<p><a href=\"/#{file.path}\">#{readMoreText}</a></p>"

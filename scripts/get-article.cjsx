React = require "react"
Article = require "./react-templates/article"

module.exports = (file) ->
  React.renderToStaticMarkup <Article file={file} />

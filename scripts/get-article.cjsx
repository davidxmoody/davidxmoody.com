React = require "react"
Article = require "./components/article"

module.exports = (file) ->
  React.renderToStaticMarkup <Article file={file} />

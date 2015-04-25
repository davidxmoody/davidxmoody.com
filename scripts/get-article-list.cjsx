React = require "react"
ArticleList = require "./react-templates/article-list"

module.exports = (file) ->
  React.renderToStaticMarkup <ArticleList file={file} />

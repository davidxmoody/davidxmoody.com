React = require "react"
ArticleList = require "./components/article-list"

module.exports = (file) ->
  React.renderToStaticMarkup <ArticleList file={file} />

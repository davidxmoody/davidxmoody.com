React = require "react"
Article = require "./article"
R = require "ramda"

module.exports = ArticleList = React.createClass
  render: ->
    articles = R.map ((file) -> <Article file={file} shortened={true} />), @props.file.pagination.files

    <div>
      {articles}
      <div dangerouslySetInnerHTML={__html: @props.file.pagination.linksHTML} />
    </div>

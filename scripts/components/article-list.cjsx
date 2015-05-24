React = require "react"
R = require "ramda"

Article = require "./article"
Pagination = require "./pagination"

makeArticles = R.mapIndexed (file, index) ->
  <Article key={index} file={file} shortened={true} />


module.exports = React.createClass
  displayName: "ArticleList"

  propTypes:
    file: React.PropTypes.object.isRequired

  render: ->
    <div>
      {makeArticles @props.file.pagination.files}
      <Pagination file={@props.file} />
    </div>

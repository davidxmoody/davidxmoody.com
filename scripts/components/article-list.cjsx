React = require "react"
Article = require "./article"
R = require "ramda"

Pagination = React.createClass
  displayName: "Pagination"

  render: ->
    file = @props.file
    pagin = file.pagination

    links = []

    links.push if pagin.previous
      <a key="prev" href={"/#{pagin.previous.path}"}>&laquo;</a>
    else
      <span key="prev">&laquo;</span>

    for page, index in pagin.pages
      links.push if file == page
        <span key={index}>{page.pagination.num}</span>
      else
        <a key={index} href={"/#{page.path}"}>{page.pagination.num}</a>

    links.push if pagin.next
      <a key="next" href={"/#{pagin.next.path}"}>&raquo;</a>
    else
      <span key="next">&raquo;</span>

    realLinks = []
    for link, i in links
      realLinks.push "|" unless i is 0
      realLinks.push link

    <p className="pagination">
      {realLinks}
    </p>


module.exports = React.createClass
  displayName: "ArticleList"

  render: ->
    makeArticles = R.mapIndexed (file, index) ->
      <Article key={index} file={file} shortened={true} />

    articles = makeArticles @props.file.pagination.files

    <div>
      {articles}
      <Pagination file={@props.file} />
    </div>

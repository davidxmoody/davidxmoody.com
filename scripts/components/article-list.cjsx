React = require "react"
Article = require "./article"
R = require "ramda"

Pagination = React.createClass
  render: ->
    file = @props.file
    pagin = file.pagination

    links = []

    links.push if pagin.previous
      <a href={"/#{pagin.previous.path}"}>&laquo;</a>
    else
      <span>&laquo;</span>

    for page in pagin.pages
      links.push if file == page
        <span>{page.pagination.num}</span>
      else
        <a href={"/#{page.path}"}>{page.pagination.num}</a>

    links.push if pagin.next
      <a href={"/#{pagin.next.path}"}>&raquo;</a>
    else
      <span>&raquo;</span>

    realLinks = []
    for link, i in links
      realLinks.push "|" unless i is 0
      realLinks.push link

    <p className="pagination">
      {realLinks}
    </p>

module.exports = ArticleList = React.createClass
  render: ->
    articles = R.map ((file) -> <Article file={file} shortened={true} />), @props.file.pagination.files

    paginationLinks = @props.file.pagination

    <div>
      {articles}
      <Pagination file={@props.file} />
    </div>

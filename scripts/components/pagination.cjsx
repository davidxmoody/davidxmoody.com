React = require "react"
PaginationLink = require "./pagination-link"

module.exports = React.createClass
  displayName: "Pagination"

  propTypes:
    file: React.PropTypes.shape(
      pagination: React.PropTypes.object.isRequired
    ).isRequired

  render: ->
    file = @props.file
    pagin = file.pagination

    links = []

    links.push <PaginationLink
      key="prev"
      disabled={not pagin.previous?}
      href={"/#{pagin.previous?.path}"}
    >&laquo;</PaginationLink>

    for page in pagin.pages
      links.push <PaginationLink
        key={page.pagination.num}
        disabled={file is page}
        href={"/#{page.path}"}
      >{page.pagination.num}</PaginationLink>

    links.push <PaginationLink
      key="next"
      disabled={not pagin.next?}
      href={"/#{pagin.next?.path}"}
    >&raquo;</PaginationLink>

    realLinks = []
    for link, i in links
      realLinks.push "|" unless i is 0
      realLinks.push link

    <p className="pagination">
      {realLinks}
    </p>

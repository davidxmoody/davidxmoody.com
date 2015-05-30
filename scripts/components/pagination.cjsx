React = require "react"

PaginationLink = React.createClass
  displayName: "PaginationLink"

  propTypes:
    href: React.PropTypes.string.isRequired
    disabled: React.PropTypes.bool.isRequired

  render: ->
    if @props.disabled
      <span className="pagination__disabled">{@props.children}</span>
    else
      <a className="pagination__link" href={@props.href}>{@props.children}</a>


module.exports = React.createClass
  displayName: "Pagination"

  propTypes:
    file: React.PropTypes.shape(
      pagination: React.PropTypes.object.isRequired
    ).isRequired

  render: ->
    file = @props.file
    pagin = file.pagination

    current = pagin.num
    last = pagin.pages.length

    ellipsis = "..."

    nums = if last <= 5
      [1..last]
    else if current <= 3
      [1, 2, 3, 4, ellipsis, last]
    else if current >= last-2
      [1, ellipsis, last-3, last-2, last-1, last]
    else
      [1, ellipsis, current-1, current, current+1, ellipsis, last]

    links = []

    links.push <PaginationLink
      key="prev"
      disabled={not pagin.previous?}
      href={"/#{pagin.previous?.path}"}
    >&laquo;</PaginationLink>

    for num, index in nums
      if num is ellipsis
        links.push <span className="pagination__ellipsis" key={"ellipsis-#{index}"} />
      else
        for page in pagin.pages
          if page.pagination.num is num
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
    for link, index in links
      realLinks.push <span className="pagination__separator" key={"separator-#{index}"} /> unless index is 0 or nums[index-2] is ellipsis or nums[index-1] is ellipsis
      realLinks.push link

    <p className="pagination">
      {realLinks}
    </p>

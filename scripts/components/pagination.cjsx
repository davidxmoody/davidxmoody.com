React = require "react"

module.exports = React.createClass
  displayName: "Pagination"

  propTypes:
    file: React.PropTypes.object.isRequired

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

React = require "react"

module.exports = React.createClass
  displayName: "PaginationLink"

  propTypes:
    children: React.PropTypes.node.isRequired
    href: React.PropTypes.string
    disabled: React.PropTypes.bool
    ellipsis: React.PropTypes.bool

  render: ->
    if @props.ellipsis
      <span>...</span>
    else if @props.disabled
      <span>{@props.children}</span>
    else
      <a href={@props.href}>{@props.children}</a>

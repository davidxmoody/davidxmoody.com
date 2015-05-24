React = require "react"

module.exports = React.createClass
  displayName: "PaginationLink"

  propTypes:
    children: React.PropTypes.node.isRequired
    href: React.PropTypes.string.isRequired
    disabled: React.PropTypes.bool

  render: ->
    if @props.disabled
      <span>{@props.children}</span>
    else
      <a href={@props.href}>{@props.children}</a>

React = require "react"

module.exports = Article = React.createClass
  render: ->
    <article>
      <header>
        <h1>{@props.file.title}</h1>
        <p><em>{@props.file.formattedDate}</em></p>
      </header>

      <div dangerouslySetInnerHTML={__html: @props.file.contents.toString()} />
    </article>

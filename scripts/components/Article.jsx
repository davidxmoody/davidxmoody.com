import React, { PropTypes } from 'react'

export default class Article extends React.Component {

  static propTypes = {
    file: PropTypes.object.isRequired,
    shortened: PropTypes.bool,
  }

  render() {
    const contents = this.props.shortened ?
      this.props.file.excerpt :
      this.props.file.contents.toString()

    return (
      <article>
        <header>
          <h1>{this.props.file.title}</h1>
          <p><em>{this.props.file.formattedDate}</em></p>
        </header>

        <div dangerouslySetInnerHTML={{__html: contents}} />
      </article>
    )
  }

}

import React, { PropTypes } from 'react'
import moment from 'moment'

export default class Article extends React.Component {

  static propTypes = {
    file: PropTypes.shape({
      date: PropTypes.object.isRequired,
      title: PropTypes.string.isRequired,
      excerpt: PropTypes.string.isRequired,
      contents: PropTypes.any.isRequired,
    }).isRequired,
    shortened: PropTypes.bool,
  }

  render() {
    const { date, title, excerpt, contents } = this.props.file
    const formattedDate = moment(date).format('ll')
    const articleContents = this.props.shortened ? excerpt : contents.toString()

    return (
      <article>
        <header>
          <h1>{title}</h1>
          <p><em>{formattedDate}</em></p>
        </header>

        <div dangerouslySetInnerHTML={{__html: articleContents}} />
      </article>
    )
  }

}

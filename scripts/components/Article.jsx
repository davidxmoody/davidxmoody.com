import React from 'react'
import moment from 'moment'

export default ({ file, shortened = false }) => {

  const { date, title, excerpt, contents } = file
  const formattedDate = moment(date).format('ll')
  const articleContents = shortened ? excerpt : contents.toString()

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

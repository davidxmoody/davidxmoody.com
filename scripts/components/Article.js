import React from 'react'
import moment from 'moment'

export default ({file, shortened = false}) => {
  const {date, title, excerpt, contents} = file
  const formattedDate = moment(date).format('ll')
  const articleContents = shortened ? excerpt : contents.toString()

  return (
    React.createElement('article', {}, 
      React.createElement('header', {},
        React.createElement('h1', {}, title),
        React.createElement('p', {}, React.createElement('em', {}, formattedDate))
      ),
      React.createElement('div', {dangerouslySetInnerHTML: {__html: articleContents}})
    )
  )
}

import React from 'react'
import ArticleList from './components/ArticleList'

export default function getArticleList(file) {
  return React.renderToStaticMarkup(<ArticleList file={file} />)
}

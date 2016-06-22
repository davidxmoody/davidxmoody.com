import React from 'react'
import Article from './Article'
import Pagination from './Pagination'

export default ({file}) => {
  const articles = file.pagination.files.map((f, index) => {
    return React.createElement(Article, {key: index, file: f, shortened: true})
  })

  const pagination = React.createElement(Pagination, {file})

  return React.createElement('div', {}, articles, pagination)
}

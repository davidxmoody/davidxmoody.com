const React = require('react')
const Article = require('./Article')
const Pagination = require('./Pagination')

module.exports = ({file}) => {
  const articles = file.pagination.files.map((f, index) => {
    return React.createElement(Article, {key: index, file: f, shortened: true})
  })

  const pagination = React.createElement(Pagination, {file})

  return React.createElement('div', {}, articles, pagination)
}

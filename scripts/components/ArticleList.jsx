import React from 'react'
import Article from './Article'
import Pagination from './Pagination'

export default ({ file }) => {

  const articles = file.pagination.files.map((f, index) => {
    return <Article key={index} file={f} shortened />
  })

  return (
    <div>
      {articles}
      <Pagination file={file} />
    </div>
  )

}

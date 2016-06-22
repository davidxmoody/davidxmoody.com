import React from 'react'
import PaginationLink from './PaginationLink'

export default ({file}) => {
  const pagin = file.pagination

  const current = pagin.num
  const last = pagin.pages.length

  const ellipsis = '...'

  let nums
  if (last <= 5) {
    nums = pagin.pages.map((page, index) => index + 1)
  } else if (current <= 3) {
    nums = [1, 2, 3, 4, ellipsis, last]
  } else if (current >= last - 2) {
    nums = [1, ellipsis, last - 3, last - 2, last - 1, last]
  } else {
    nums = [1, ellipsis, current - 1, current, current + 1, ellipsis, last]
  }

  const links = []

  links.push(React.createElement(PaginationLink, {
    key: 'prev',
    disabled: !pagin.previous,
    href: pagin.previous ? pagin.previous.relativeURL : '',
  }, '«'))

  nums.forEach((num, index) => {
    if (num === ellipsis) {
      links.push(React.createElement('span', {
        key: 'ellipsis-' + index,
        className: 'pagination__ellipsis',
      }))
    } else {
      for (const page of pagin.pages) {
        if (page.pagination.num === num) {
          links.push(React.createElement(PaginationLink, {
            key: page.pagination.num,
            disabled: file === page,
            href: page.relativeURL,
          }, page.pagination.num))
        }
      }
    }
  })

  links.push(React.createElement(PaginationLink, {
    key: 'next',
    disabled: !pagin.next,
    href: pagin.next ? pagin.next.relativeURL : '',
  }, '»'))

  const realLinks = []
  links.forEach((link, index) => {
    if (index && nums[index - 2] !== ellipsis && nums[index - 1] !== ellipsis) {
      realLinks.push(React.createElement('span', {
        key: 'separator-' + index,
        className: 'pagination__separator',
      }))
    }
    realLinks.push(link)
  })

  return React.createElement('p', {className: 'pagination'}, realLinks)
}

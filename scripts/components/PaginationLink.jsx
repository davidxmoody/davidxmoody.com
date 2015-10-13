import React from 'react'

export default ({ href, disabled, children }) => {

  if (disabled) {
    return <span className="pagination__disabled">{children}</span>
  }

  return <a className="pagination__link" href={href}>{children}</a>

}

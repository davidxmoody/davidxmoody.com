import React, { PropTypes } from 'react'

export default class PaginationLink extends React.Component {

  static propTypes = {
    href: PropTypes.string.isRequired,
    disabled: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
  }

  render() {
    if (this.props.disabled) {
      return <span className="pagination__disabled">{this.props.children}</span>
    }

    return <a className="pagination__link" href={this.props.href}>{this.props.children}</a>
  }

}

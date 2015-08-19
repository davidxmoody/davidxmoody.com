import React from 'react'

export default React.createClass({
  displayName: 'PaginationLink',

  propTypes: {
    href: React.PropTypes.string.isRequired,
    disabled: React.PropTypes.bool.isRequired,
    children: React.PropTypes.node.isRequired,
  },

  render() {
    if (this.props.disabled) {
      return <span className="pagination__disabled">{this.props.children}</span>
    }

    return <a className="pagination__link" href={this.props.href}>{this.props.children}</a>
  },
})

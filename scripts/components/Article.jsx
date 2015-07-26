import React from 'react';
import cx from 'classnames';
import R from 'ramda';

export default React.createClass({
  displayName: 'Article',

  propTypes: {
    file: React.PropTypes.object.isRequired,
    shortened: React.PropTypes.bool,
  },

  render() {
    let contents;
    if (this.props.shortened) {
      contents = this.props.file.excerpt;
    } else {
      contents = this.props.file.contents.toString();
    }

    const isFeatured = R.contains("featured", this.props.file.tags);
    const classes = cx("", {
      "article--featured": isFeatured,
      "article--not-featured": !isFeatured,
    });

    return (
      <article className={classes}>
        <header>
          <h1>{this.props.file.title}</h1>
          <p><em>{this.props.file.formattedDate}</em></p>
        </header>

        <div dangerouslySetInnerHTML={{__html: contents}} />
      </article>
    );
  },
});

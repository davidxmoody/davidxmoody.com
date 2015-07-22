import React from 'react';

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

    return (
      <article>
        <header>
          <h1>{this.props.file.title}</h1>
          <p><em>{this.props.file.formattedDate}</em></p>
        </header>

        <div dangerouslySetInnerHTML={{__html: contents}} />
      </article>
    );
  },
});

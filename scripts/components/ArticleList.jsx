import React from 'react';

import Article from './Article';
import Pagination from './Pagination';

export default React.createClass({
  displayName: 'ArticleList',

  propTypes: {
    file: React.PropTypes.object.isRequired,
  },

  render() {
    const articles = this.props.file.pagination.files.map((file, index) => {
      return <Article key={index} file={file} shortened={true} />;
    });

    return (
      <div>
        {articles}
        <Pagination file={this.props.file} />
      </div>
    );
  },
});

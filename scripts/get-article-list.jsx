import React from 'react';
import ArticleList from './components/article-list';

export default function getArticleList(file) {
  return React.renderToStaticMarkup(<ArticleList file={file} />);
};

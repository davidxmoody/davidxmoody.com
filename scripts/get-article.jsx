import React from 'react';
import Article from './components/article';

export default function getArticle(file) {
  return React.renderToStaticMarkup(<Article file={file} />);
};

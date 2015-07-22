import React from 'react';
import Article from './components/Article';

export default function getArticle(file) {
  return React.renderToStaticMarkup(<Article file={file} />);
}

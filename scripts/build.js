import path from 'path';
import moment from 'moment';
import cheerio from 'cheerio';

import getArticle from './get-article';
import getArticleList from './get-article-list';

import Metalsmith from 'metalsmith';
import autoprefixer from 'metalsmith-autoprefixer';
import beautify from 'metalsmith-beautify';
import blc from 'metalsmith-broken-link-checker';
import collections from 'metalsmith-collections';
import drafts from 'metalsmith-drafts';
import feed from 'metalsmith-feed';
import fingerprint from 'metalsmith-fingerprint';
import ignore from 'metalsmith-ignore';
import layouts from 'metalsmith-layouts';
import pagination from 'metalsmith-pagination';
import permalinks from 'metalsmith-permalinks';
import sass from 'metalsmith-sass';
import sitemap from 'metalsmith-sitemap';

import excerpts from './excerpts';
import markdown from './markdown';

const METADATA = {
  title: "David Moody's Blog",
  description: 'A blog about programming',
  tagline: 'A blog about programming',
  url: 'https://davidxmoody.com/',
  feedPath: 'feed.xml',
  sitemapPath: 'sitemap.xml',
  gitHubURL: 'https://github.com/davidxmoody',
  email: 'david@davidxmoody.com',
  excerptSeparator: '\n\n\n',
  maxDescriptionLength: 155,
};

const DEFAULT_OPTIONS = {
  production: true,
};

export default function(specifiedOptions, callback) {
  const options = Object.assign({}, DEFAULT_OPTIONS, specifiedOptions);

  // CONFIG ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const m = Metalsmith(path.resolve(__dirname, '..'));
  m.metadata(METADATA);

  // POSTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(drafts());
  }

  m.use(function(files) {
    for (const filename in files) {
      const file = files[filename];

      // Format dates
      if (file.date) {
        file.date = moment(file.date);
        file.formattedDate = file.date.format('ll');
      }

      // Parse tags
      if (file.tags && typeof file.tags === 'string') {
        file.tags = file.tags.split(', ');
      }
    }
  });

  m.use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true,
    },
  }));

  // Replace custom excerpt separator with <!--more--> tag before markdown runs
  m.use(function(files, metalsmith) {
    for (const file of metalsmith.metadata().posts) {
      const oldContents = file.contents.toString();
      const newContents = oldContents.replace(METADATA.excerptSeparator, '\n\n<!--more-->\n\n');
      file.contents = new Buffer(newContents);
    }
  });

  m.use(markdown());

  m.use(function(files, metalsmith) {
    for (const file of metalsmith.metadata().posts) {
      if (!file.description) {
        const $ = cheerio.load(file.contents.toString());
        // This is a very awkward way of doing this
        let description = $('p').map(function() { return $(this).text(); }).get().join(' ').replace('  ', ' ');
        if (description.length > METADATA.maxDescriptionLength) {
          description = description.slice(0, METADATA.maxDescriptionLength - 3);
          description = description.replace(/[,.!?:;]?\s*\S*$/, '...');
        }
        file.description = description;
      }
    }
  });

  m.use(permalinks({
    pattern: ':title/',
  }));

  // HOME PAGE PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(pagination({
    'collections.posts': {
      perPage: 5,
      first: 'index.html',
      template: 'NOT_USED',
      path: 'page:num/index.html',
      pageMetadata: {
        rtemplate: 'ArticleList',
      },
    },
  }));

  // Don't duplicate the first page
  m.use(ignore(['page1/index.html']));

  // Clean up paths to provide clean URLs
  m.use(function(files) {
    for (const filename in files) {
      const file = files[filename];
      file.path = filename.replace(/index.html$/, '');
      file.canonical = METADATA.url + filename.replace(/index.html$/, '');
    }
  });

  // EXCERPTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(excerpts());

  // CSS AND FINGERPRINTING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(sass());
  m.use(autoprefixer());

  m.use(fingerprint({pattern: 'css/main.css'}));
  m.use(ignore(['css/_*.sass', 'css/main.css']));

  // TEMPLATES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(function(files, metalsmith) {
    for (const file of metalsmith.metadata().posts) {
      file.contents = new Buffer(getArticle(file));
    }
    for (const filename in files) {
      const file = files[filename];
      if (file.rtemplate === 'ArticleList') {
        file.contents = new Buffer(getArticleList(file));
      }
    }
  });

  m.use(layouts({
    engine: 'handlebars',
    pattern: '**/*.html',
    'default': 'wrapper.hbs',
  }));

  // PRODUCTION ONLY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {

    // BEAUTIFY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(beautify({
      wrap_line_length: 100000,
      indent_size: 0,
    }));

    // SITEMAP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(sitemap({
      ignoreFiles: [/^CNAME$/, /\.css$/, /\.js$/, /\.jpg$/, /\.png$/],
      output: METADATA.sitemapPath,
      urlProperty: 'canonical',
      hostname: METADATA.url,
      modifiedProperty: 'modified',
      defaults: {
        priority: 0.5,
        changefreq: 'daily',
      },
    }));

    // RSS FEED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(feed({
      collection: 'posts',
      limit: 100,
      destination: METADATA.feedPath,
      title: METADATA.title,
      site_url: METADATA.url,
      description: METADATA.description,
    }));

    // Make all relative links and images into absolute links and images
    m.use(function(files) {
      const file = files[METADATA.feedPath];
      file.contents = new Buffer(
        file.contents.toString().replace(/(src|href)="\//g, '$1="' + METADATA.url)
      );
    });

    // BROKEN LINK CHECKER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(blc());

  }

  // BUILD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.build(function(err) {
    callback(err);
  });
}

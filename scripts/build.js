import React from 'react'
import ReactDOMServer from 'react-dom/server'
import path from 'path'

import Article from './components/Article'
import ArticleList from './components/ArticleList'

import Metalsmith from 'metalsmith'
import autoprefixer from 'metalsmith-autoprefixer'
import beautify from 'metalsmith-beautify'
import blc from 'metalsmith-broken-link-checker'
import collections from 'metalsmith-collections'
import drafts from 'metalsmith-drafts'
import feed from 'metalsmith-feed'
import fingerprint from 'metalsmith-fingerprint'
import ignore from 'metalsmith-ignore'
import layouts from 'metalsmith-layouts'
import pagination from 'metalsmith-pagination'
import permalinks from 'metalsmith-permalinks'
import sass from 'metalsmith-sass'
import sitemap from 'metalsmith-sitemap'

import excerpts from './plugins/excerpts'
import markdown from './plugins/markdown'
import descriptions from './plugins/descriptions'

const DEFAULT_OPTIONS = {
  title: "David Moody's Blog",
  description: 'A blog about programming',
  url: 'https://davidxmoody.com/',
  feedPath: 'feed.xml',
  sitemapPath: 'sitemap.xml',
  gitHubURL: 'https://github.com/davidxmoody',
  email: 'david@davidxmoody.com',
  production: true,
}

export default function(specifiedOptions = {}, callback) {

  const options = Object.assign({}, DEFAULT_OPTIONS, specifiedOptions)

  // CONFIG ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const m = Metalsmith(path.resolve(__dirname, '..'))
  m.metadata(options)

  // POSTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(drafts())
  }

  m.use(collections({
    posts: {
      pattern: 'posts/*.md',
      sortBy: 'date',
      reverse: true,
    },
  }))

  m.use(markdown())

  m.use(descriptions())

  m.use(permalinks({pattern: ':title/'}))

  // HOME PAGE PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(pagination({
    'collections.posts': {
      perPage: 9,
      first: 'index.html',
      layout: 'wrapper.hbs',
      path: 'page:num/index.html',
      pageMetadata: {
        rtemplate: 'ArticleList',
      },
    },
  }))

  // Don't duplicate the first page
  m.use(ignore(['page1/index.html']))

  m.use(files => {
    for (const filename in files) {
      const file = files[filename]
      file.relativeURL = '/' + filename.replace(/index.html$/, '')
      file.canonicalURL = options.url + filename.replace(/index.html$/, '')
    }
  })

  // EXCERPTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(excerpts())

  // CSS AND FINGERPRINTING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(sass())
  m.use(autoprefixer())

  m.use(fingerprint({pattern: 'css/main.css'}))
  m.use(ignore(['css/_*.sass', 'css/main.css']))

  // TEMPLATES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use((files, metalsmith) => {
    for (const file of metalsmith.metadata().posts) {
      const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(Article, {file}))
      file.contents = new Buffer(markup)
    }
    for (const filename in files) {
      const file = files[filename]
      if (file.rtemplate === 'ArticleList') {
        const markup = ReactDOMServer.renderToStaticMarkup(React.createElement(ArticleList, {file}))
        file.contents = new Buffer(markup)
      }
    }
  })

  m.use(layouts({
    engine: 'handlebars',
    pattern: '**/*.html',
    default: 'wrapper.hbs',
  }))

  // PRODUCTION ONLY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {

    // BEAUTIFY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(beautify({
      wrap_line_length: 100000,
      indent_size: 0,
    }))

    // SITEMAP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(sitemap({
      ignoreFiles: [/^CNAME$/, /\.css$/, /\.js$/, /\.jpg$/, /\.png$/],
      output: options.sitemapPath,
      urlProperty: 'canonicalURL',
      hostname: options.url,
      modifiedProperty: 'modified',
      defaults: {
        priority: 0.5,
        changefreq: 'daily',
      },
    }))

    // RSS FEED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(feed({
      collection: 'posts',
      limit: 100,
      destination: options.feedPath,
      title: options.title,
      site_url: options.url,
      description: options.description,
    }))

    // Make all relative links and images into absolute links and images
    m.use(files => {
      const file = files[options.feedPath]
      file.contents = new Buffer(
        file.contents.toString().replace(/(src|href)="\//g, '$1="' + options.url)
      )
    })

    // BROKEN LINK CHECKER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(blc())

  }

  // BUILD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.build(callback)

}

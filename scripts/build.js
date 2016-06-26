const path = require('path')
const moment = require('moment')

const Metalsmith = require('metalsmith')
const autoprefixer = require('metalsmith-autoprefixer')
const blc = require('metalsmith-broken-link-checker')
const collections = require('metalsmith-collections')
const drafts = require('metalsmith-drafts')
const feed = require('metalsmith-feed')
const fingerprint = require('metalsmith-fingerprint')
const ignore = require('metalsmith-ignore')
const layouts = require('metalsmith-layouts')
const pagination = require('metalsmith-pagination')
const permalinks = require('metalsmith-permalinks')
const sass = require('metalsmith-sass')
const sitemap = require('metalsmith-sitemap')

const excerpts = require('./plugins/excerpts')
const markdown = require('./plugins/markdown')
const descriptions = require('./plugins/descriptions')

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

module.exports = (specifiedOptions = {}, callback) => {

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

  m.use((files, metalsmith) => {
    for (const file of metalsmith.metadata().posts) {
      file.layout = 'post.njk'
      file.formattedDate = moment(file.date).format('ll')
    }
  })

  m.use(markdown())

  m.use(descriptions())

  m.use(permalinks({pattern: ':title/'}))

  // HOME PAGE PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(pagination({
    'collections.posts': {
      perPage: 9,
      first: 'index.html',
      layout: 'post-list.njk',
      path: 'page:num/index.html',
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

  // LAYOUTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(layouts({
    engine: 'nunjucks',
    pattern: '**/*.html',
    default: 'page.njk',
  }))

  // PRODUCTION ONLY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {

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

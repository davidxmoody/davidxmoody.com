const path = require("path")
const moment = require("moment")

const Metalsmith = require("metalsmith")
const autoprefixer = require("metalsmith-autoprefixer")
const blc = require("metalsmith-broken-link-checker")
const collections = require("metalsmith-collections")
const drafts = require("metalsmith-drafts")
const feed = require("metalsmith-feed")
const layouts = require("metalsmith-layouts")
const pagination = require("metalsmith-pagination")
const permalinks = require("metalsmith-permalinks")
const sass = require("metalsmith-sass")
const sitemap = require("metalsmith-sitemap")

const excerpts = require("./plugins/excerpts")
const markdown = require("./plugins/markdown")

const SITE_URL = "https://davidxmoody.com/"

module.exports = (options = {}, callback) => {

  const m = Metalsmith(path.resolve(__dirname, ".."))

  // POSTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(drafts())
  }

  m.use(collections({
    posts: {
      pattern: "posts/*.md",
      sortBy: "date",
      reverse: true,
    },
  }))

  m.use((files, metalsmith) => {
    for (const file of metalsmith.metadata().posts) {
      file.layout = "post.html"
      file.formattedDate = moment(file.date).format("ll")
    }
  })

  m.use(markdown())

  m.use(permalinks({pattern: ":title/"}))

  // HOME PAGE PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(pagination({
    "collections.posts": {
      perPage: 9,
      first: "index.html",
      layout: "post-list.html",
      path: "page:num/index.html",
    },
  }))

  // Don"t duplicate the first page
  m.use(files => delete files["page1/index.html"])

  m.use(files => {
    for (const filename in files) {
      const file = files[filename]
      file.relativeURL = "/" + filename.replace(/index.html$/, "")
      file.canonicalURL = SITE_URL + filename.replace(/index.html$/, "")
    }
  })

  // EXCERPTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(excerpts())

  // CSS AND FINGERPRINTING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(sass())
  m.use(autoprefixer())

  // LAYOUTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(layouts({
    engine: "nunjucks",
    pattern: "**/*.html",
    default: "page.html",
  }))

  // PRODUCTION ONLY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {

    // SITEMAP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(sitemap({
      ignoreFiles: [/^CNAME$/, /\.css$/, /\.js$/, /\.jpg$/, /\.png$/],
      output: "sitemap.xml",
      urlProperty: "canonicalURL",
      hostname: SITE_URL,
      modifiedProperty: "modified",
      defaults: {
        priority: 0.5,
        changefreq: "daily",
      },
    }))

    // RSS FEED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(feed({
      collection: "posts",
      limit: 100,
      destination: "feed.xml",
      title: "David Moody's blog",
      site_url: SITE_URL,
      description: "A blog about programming",
    }))

    // Make all relative links and images into absolute links and images
    m.use(files => {
      const file = files["feed.xml"]
      file.contents = new Buffer(
        file.contents.toString().replace(/(src|href)="\//g, "$1=\"" + SITE_URL)
      )
    })

    // BROKEN LINK CHECKER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    m.use(blc())

  }

  // BUILD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.build(callback)

}

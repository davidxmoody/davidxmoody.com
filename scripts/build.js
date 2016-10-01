const path = require("path")
const moment = require("moment")

const Metalsmith = require("metalsmith")
const autoprefixer = require("metalsmith-autoprefixer")
const blc = require("metalsmith-broken-link-checker")
const drafts = require("metalsmith-drafts")
const feed = require("metalsmith-feed")
const layouts = require("metalsmith-layouts")
const sass = require("metalsmith-sass")
const sitemap = require("metalsmith-sitemap")

const prettyUrls = require("./plugins/pretty-urls")
const excerpts = require("./plugins/excerpts")
const markdown = require("./plugins/markdown")

const SITE_URL = "https://davidxmoody.com/"

module.exports = (options = {}, callback) => {

  const prodOnly = plugin => options.production ? plugin : () => undefined

  Metalsmith(path.resolve(__dirname, ".."))

    .use(prodOnly(drafts()))
    .use(markdown())
    .use(prettyUrls())

    .use(files => {
      Object.keys(files).forEach(filename => {
        const file = files[filename]

        file.relativeURL = "/" + filename.replace(/index.html$/, "")
        file.canonicalURL = SITE_URL + filename.replace(/index.html$/, "")

        if (file.date) {
          file.formattedDate = moment(file.date).format("ll")
        }
      })
    })

    .use(excerpts())

    .use(sass())
    .use(autoprefixer())

    .use(layouts({
      engine: "nunjucks",
      pattern: "**/*.html",
    }))

    .use(prodOnly(sitemap({
      ignoreFiles: [/^CNAME$/, /\.css$/, /\.js$/, /\.jpg$/, /\.png$/],
      output: "sitemap.xml",
      urlProperty: "canonicalURL",
      hostname: SITE_URL,
      modifiedProperty: "modified",
      defaults: {priority: 0.5, changefreq: "daily"},
    })))

    .use(prodOnly(feed({
      collection: "posts",
      limit: 100,
      destination: "feed.xml",
      title: "David Moody's blog",
      site_url: SITE_URL,
      description: "A blog about programming",
    })))
    .use(prodOnly(files => {
      const file = files["feed.xml"]
      file.contents = new Buffer(
        file.contents.toString().replace(/(src|href)="\//g, "$1=\"" + SITE_URL)
      )
    }))

    .use(prodOnly(blc()))

    .build(callback)
}

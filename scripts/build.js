const path = require("path")
const moment = require("moment")

const Metalsmith = require("metalsmith")
const autoprefixer = require("metalsmith-autoprefixer")
const blc = require("metalsmith-broken-link-checker")
const collections = require("metalsmith-collections")
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

  const prodOnly = (plugin) => options.production ? plugin : () => undefined

  Metalsmith(path.resolve(__dirname, ".."))

    .use(prodOnly(drafts()))
    .use(markdown())
    .use(prettyUrls())

    .use((files, metalsmith) => {
      const tagCounts = {}

      Object.keys(files).forEach((filename) => {
        const file = files[filename]

        file.relativeURL = "/" + filename.replace(/index.html$/, "")
        file.canonicalURL = SITE_URL + filename.replace(/index.html$/, "")
        file.url = file.canonicalURL // For feeds plugin

        file.tags = file.tags || []
        file.tags = typeof file.tags === "string" ? file.tags.split(/, ?/g) : file.tags
        for (const tag of file.tags) {
          if (tag === "all") continue
          tagCounts[tag] = (tagCounts[tag] || 0) + 1
        }
        if (file.layout === "post.html") {
          // Very hacky temporary stuff...
          tagCounts.all = (tagCounts.all || 0) + 1
        }

        if (file.date) {
          file.formattedDate = moment(file.date).format("ll")
        }
      })

      // Hacky code because I don't know if I want to keep this yet
      metalsmith.metadata().allTags = Object.keys(tagCounts).concat(["all"])
      const tagList = Object.keys(tagCounts).map((tag) => {
        return {
          name: tag,
          count: tagCounts[tag],
        }
      }).filter(({name}) => name !== "junk")
      tagList.sort((a, b) => {
        // Put "featured" at the start always
        if (a.name === "featured") return -1
        if (b.name === "featured") return 1
        // Put "all" at the end always (super hacky code this is)
        if (a.name === "all") return 1
        if (b.name === "all") return -1
        // Sort in descending count order, subsort by ascending name
        if (a.count > b.count) return -1
        if (a.count < b.count) return 1
        if (a.name < b.name) return -1
        if (a.name > b.name) return 1
        return 0
      })
      metalsmith.metadata().tagList = tagList
    })

    .use(excerpts())

    .use(collections({
      posts: {
        pattern: "2???/*/index.html", // Hacky
        sortBy: "date",
        reverse: true,
      },
    }))

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
    .use(prodOnly((files) => {
      const file = files["feed.xml"]
      file.contents = new Buffer(
        file.contents.toString().replace(/(src|href)="\//g, "$1=\"" + SITE_URL)
      )
    }))

    .use(prodOnly(blc()))

    .build(callback)
}

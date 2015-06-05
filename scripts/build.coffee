console.time "Require"

require "coffee-react/register"
getArticle = require "./get-article"
getArticleList = require "./get-article-list"

moment = require "moment"
R = require "ramda"

Metalsmith     = require "metalsmith"
autoprefixer   = require "metalsmith-autoprefixer"
beautify       = require "metalsmith-beautify"
blc            = require "metalsmith-broken-link-checker"
collections    = require "metalsmith-collections"
dateInFilename = require "metalsmith-date-in-filename"
feed           = require "metalsmith-feed"
fingerprint    = require "metalsmith-fingerprint"
ignore         = require "metalsmith-ignore"
layouts        = require "metalsmith-layouts"
pagination     = require "metalsmith-pagination"
permalinks     = require "metalsmith-permalinks"
sass           = require "metalsmith-sass"

markdown = require "./markdown"
excerpts = require "./excerpts"

console.timeEnd "Require"

#TODO could move this into build script or separate file? or simply as defaults
#for the options parameter
METADATA =
  title: "David Moody's Blog"
  description: "A blog about programming"
  url: "https://davidxmoody.com/"
  feedPath: "feed.xml"
  gitHubURL: "https://github.com/davidxmoody"
  email: "david@davidxmoody.com"
  excerptSeparator: "\n\n\n"

defaultOptions =
  production: true

module.exports = (options, callback) ->

  options = R.merge defaultOptions, options

  console.time "Build"

  # CONFIG ####################################################################

  m = Metalsmith(__dirname + "/..")
  m.clean true
  m.metadata METADATA

  # POSTS #####################################################################

  m.use -> console.time "Markdown"

  m.use (files) ->
    for filename, file of files
      if options.production and file.draft
        console.log "Warning: Skipping one draft: #{filename}"
        delete files[filename]
  
  m.use dateInFilename()
  
  m.use (files) ->
    for filename, file of files
      if file.date
        file.formattedDate = moment(file.date).format("ll")

  m.use collections posts:
    pattern: "posts/*.md"
    sortBy: "date"
    reverse: true
  
  # Convert space separated string of tags into a list
  m.use (files) ->
    for filename, file of files
      if file.tags and typeof file.tags == "string"
        file.tags = file.tags.split(" ")

  # Replace custom excerpt separator with <!--more--> tag before markdown runs
  m.use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer(file.contents.toString().replace(METADATA.excerptSeparator, "\n\n<!--more-->\n\n"))

  m.use markdown()
  m.use permalinks pattern: ":title/"

  m.use -> console.timeEnd "Markdown"

  # HOME PAGE PAGINATION ######################################################

  m.use -> console.time "Pagination"
  
  m.use pagination "collections.posts":
    perPage: 5
    first: "index.html"
    template: "NOT_USED" #TODO do this better (with proper react templates plugin)
    path: "page:num/index.html"
    pageMetadata:
      rtemplate: "ArticleList"
  
  # Don"t duplicate the first page
  m.use ignore ["page1/index.html"]
  
  # Clean up paths to provide clean URLs
  m.use (files) ->
    for filename, file of files
      file.path = filename.replace(/index.html$/, "")

  m.use -> console.timeEnd "Pagination"

  # EXCERPTS ##################################################################

  m.use -> console.time "Excerpts"
  m.use excerpts()
  m.use -> console.timeEnd "Excerpts"

  # CSS AND FINGERPRINTING ####################################################

  m.use -> console.time "Sass"

  m.use sass()
  m.use autoprefixer()
  
  m.use fingerprint pattern: "css/main.css"
  m.use ignore ["css/_*.sass", "css/main.css"]

  m.use -> console.timeEnd "Sass"

  # TEMPLATES #################################################################

  m.use -> console.time "Templates"

  # Custom React templates
  #TODO could implement this much better, maybe use the existing react plugin
  m.use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer getArticle(file)
    for filename, file of files
      if file.rtemplate is "ArticleList"
        file.contents = new Buffer getArticleList(file)

  m.use layouts engine: "handlebars", pattern: "**/*.html", default: "wrapper.hbs"

  m.use -> console.timeEnd "Templates"

  # BEAUTIFY ##################################################################
  
  if options.production
    m.use -> console.time "Beautify"

    m.use beautify
      wrap_line_length: 100000
      indent_size: 0

    m.use -> console.timeEnd "Beautify"

  # RSS FEED ##################################################################
    
  if options.production
    m.use -> console.time "Feed"

    m.use feed
      collection: "posts"
      limit: 100
      destination: METADATA.feedPath
      title: METADATA.title
      site_url: METADATA.url
      description: METADATA.description

    # Make all relative links and images into absolute links and images
    m.use (files) ->
      data = files[METADATA.feedPath]
      replaced = data.contents.toString().replace(/(src|href)="\//g, "$1=\"#{METADATA.url}")
      data.contents = new Buffer(replaced)

    m.use -> console.timeEnd "Feed"

  # BROKEN LINK CHECKER #######################################################
  
  if options.production
    m.use -> console.time "Broken link checker"
    m.use blc()
    m.use -> console.timeEnd "Broken link checker"

  # BUILD #####################################################################

  m.build (err) ->
    console.timeEnd "Build"
    callback err

console.time "Require"

require "coffee-react/register"
getArticle = require "./get-article"
getArticleList = require "./get-article-list"

moment = require "moment"

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
serve          = require "metalsmith-serve"

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

module.exports = (options, callback) ->

  #TODO maybe Ramda merge these options?
  options ?= {}
  options.production ?= true

  console.time "Build"

  # CONFIG ####################################################################

  M = Metalsmith(__dirname + "/..")
  M.clean true
  M.metadata METADATA

  # POSTS #####################################################################

  M.use -> console.time "Markdown"
  
  M.use dateInFilename()
  
  M.use (files) ->
    for filename, file of files
      if file.date
        file.formattedDate = moment(file.date).format("ll")

  M.use collections posts:
    pattern: "posts/*.md"
    sortBy: "date"
    reverse: true
  
  # Convert space separated string of tags into a list
  M.use (files) ->
    for filename, file of files
      if file.tags and typeof file.tags == "string"
        file.tags = file.tags.split(" ")

  # Replace custom excerpt separator with <!--more--> tag before markdown runs
  M.use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer(file.contents.toString().replace(METADATA.excerptSeparator, "\n\n<!--more-->\n\n"))

  M.use markdown()
  M.use permalinks pattern: ":title/"

  M.use -> console.timeEnd "Markdown"

  # HOME PAGE PAGINATION ######################################################

  M.use -> console.time "Pagination"
  
  M.use pagination "collections.posts":
    perPage: 5
    first: "index.html"
    template: "NOT_USED" #TODO do this better (with proper react templates plugin)
    path: "page:num/index.html"
    pageMetadata:
      rtemplate: "ArticleList"
  
  # Don"t duplicate the first page
  M.use ignore ["page1/index.html"]
  
  # Clean up paths to provide clean URLs
  M.use (files) ->
    for filename, file of files
      file.path = filename.replace(/index.html$/, "")

  M.use -> console.timeEnd "Pagination"

  # EXCERPTS ##################################################################

  M.use -> console.time "Excerpts"
  M.use excerpts()
  M.use -> console.timeEnd "Excerpts"

  # CSS AND FINGERPRINTING ####################################################

  M.use -> console.time "Sass"

  M.use sass()
  M.use autoprefixer()
  
  M.use fingerprint pattern: "css/main.css"
  M.use ignore ["css/_*.sass", "css/main.css"]

  M.use -> console.timeEnd "Sass"

  # TEMPLATES #################################################################

  M.use -> console.time "Templates"

  # Custom React templates
  #TODO could implement this much better, maybe use the existing react plugin
  M.use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer getArticle(file)
    for filename, file of files
      if file.rtemplate is "ArticleList"
        file.contents = new Buffer getArticleList(file)

  M.use layouts engine: "handlebars", pattern: "**/*.html", default: "wrapper.hbs"

  M.use -> console.timeEnd "Templates"

  # BEAUTIFY ##################################################################
  
  if options.production
    M.use -> console.time "Beautify"

    M.use beautify
      wrap_line_length: 100000
      indent_size: 0

    M.use -> console.timeEnd "Beautify"

  # RSS FEED ##################################################################
    
  if options.production
    M.use -> console.time "Feed"

    M.use feed
      collection: "posts"
      limit: 100
      destination: METADATA.feedPath
      title: METADATA.title
      site_url: METADATA.url
      description: METADATA.description

    # Make all relative links and images into absolute links and images
    M.use (files) ->
      data = files[METADATA.feedPath]
      replaced = data.contents.toString().replace(/(src|href)="\//g, "$1=\"#{METADATA.url}")
      data.contents = new Buffer(replaced)

    M.use -> console.timeEnd "Feed"

  # BROKEN LINK CHECKER #######################################################
  
  if options.production
    M.use -> console.time "Broken link checker"
    M.use blc()
    M.use -> console.timeEnd "Broken link checker"

  # BUILD #####################################################################

  M.build (err) ->
    console.timeEnd "Build"
    callback err

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
sitemap        = require "metalsmith-sitemap"

markdown = require "./markdown"
excerpts = require "./excerpts"


#TODO could move this into build script or separate file? or simply as defaults
#for the options parameter
METADATA =
  title: "David Moody's Blog"
  description: "A blog about programming"
  url: "https://davidxmoody.com/"
  feedPath: "feed.xml"
  sitemapPath: "sitemap.xml"
  gitHubURL: "https://github.com/davidxmoody"
  email: "david@davidxmoody.com"
  excerptSeparator: "\n\n\n"

defaultOptions =
  production: true

module.exports = (options, callback) ->

  options = R.merge defaultOptions, options

  # CONFIG ####################################################################

  m = Metalsmith(__dirname + "/..")
  m.clean true
  m.metadata METADATA

  # POSTS #####################################################################

  if options.production
    m.use (files) ->
      for filename, file of files
        if file.draft
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


  # HOME PAGE PAGINATION ######################################################
  
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

  # EXCERPTS ##################################################################

  m.use excerpts()

  # CANONICAL URLS ############################################################

  m.use (files) ->
    for filename, file of files
      file.canonical = METADATA.url + filename.replace(/index.html$/, "")

  # CSS AND FINGERPRINTING ####################################################

  m.use sass()
  m.use autoprefixer()
  
  m.use fingerprint pattern: "css/main.css"
  m.use ignore ["css/_*.sass", "css/main.css"]

  # TEMPLATES #################################################################

  # Custom React templates
  #TODO could implement this much better, maybe use the existing react plugin
  m.use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer getArticle(file)
    for filename, file of files
      if file.rtemplate is "ArticleList"
        file.contents = new Buffer getArticleList(file)

  m.use layouts engine: "handlebars", pattern: "**/*.html", default: "wrapper.hbs"

  # BEAUTIFY ##################################################################
  
  if options.production
    m.use beautify
      wrap_line_length: 100000
      indent_size: 0

  # SITEMAP ###################################################################
  
  if options.production
    #TODO for some reason this does not include the home page or any pagination
    #pages, figure out why that happens and decide if it is a problem

    m.use sitemap
      ignoreFiles: [/^CNAME$/, /\.css$/, /\.js$/, /\.jpg$/, /\.png$/]
      output: METADATA.sitemapPath
      urlProperty: "canonical"
      hostname: METADATA.url
      modifiedProperty: "modified"
      defaults:
        priority: 0.5
        changefreq: "daily"

  # RSS FEED ##################################################################
    
  if options.production
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

  # BROKEN LINK CHECKER #######################################################
  
  if options.production
    m.use blc()

  # BUILD #####################################################################

  m.build (err) ->
    callback err
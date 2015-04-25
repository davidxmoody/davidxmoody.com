require "coffee-react/register"

React = require "react"
getArticle = require "./get-article"
getArticleList = require "./get-article-list"

moment = require 'moment'

Metalsmith     = require 'metalsmith'
beautify       = require 'metalsmith-beautify'
collections    = require 'metalsmith-collections'
dateInFilename = require 'metalsmith-date-in-filename'
drafts         = require 'metalsmith-drafts'
feed           = require 'metalsmith-feed'
fingerprint    = require 'metalsmith-fingerprint'
ignore         = require 'metalsmith-ignore'
layouts        = require 'metalsmith-layouts'
pagination     = require 'metalsmith-pagination'
pdf            = require 'metalsmith-pdf'
permalinks     = require 'metalsmith-permalinks'
sass           = require 'metalsmith-sass'
serve          = require 'metalsmith-serve'

markdown = require './markdown'
excerpts = require './excerpts'

METADATA =
  title: 'David Moody\'s Blog'
  description: 'A blog about programming'
  url: 'http://davidxmoody.com'
  feedPath: 'feed.xml'
  gitHubURL: 'https://github.com/davidxmoody'
  email: 'david@davidxmoody.com'
  excerptSeparator: '\n\n\n'

start = new Date()

Metalsmith(__dirname + '/..')

  # CONFIG ####################################################################

  .clean true
  .metadata METADATA

  # POSTS #####################################################################
  
  #TODO do drafts better
  .use drafts()
  
  #TODO choose a better method of post naming
  .use dateInFilename()
  
  .use (files) ->
    for filename, file of files
      if file.date
        file.formattedDate = moment(file.date).format('ll')

  .use collections posts: {
    pattern: 'posts/*.md'
    sortBy: 'date'
    reverse: true
  }
  
  # Convert space separated string of tags into a list
  .use (files) ->
    for filename, file of files
      if file.tags and typeof file.tags == 'string'
        file.tags = file.tags.split(' ')

  # Replace custom excerpt separator with <!--more--> tag
  .use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer(file.contents.toString().replace(METADATA.excerptSeparator, '\n\n<!--more-->\n\n'))

  .use markdown()
  
  .use permalinks pattern: ':title/'

  # HOME PAGE PAGINATION ######################################################
  
  .use pagination 'collections.posts': {
    perPage: 8
    template: 'list.html'
    first: 'index.html'
    path: 'page:num/index.html'
    pageMetadata:
      reactTemplate: 'ArticleList'
  }
  
  # Don't duplicate the first page
  .use ignore ['page1/index.html']
  
  # Clean up paths to provide clean URLs
  .use (files) ->
    for filename, file of files
      file.path = filename.replace(/index.html$/, '')

  # EXCERPTS ##################################################################

  .use excerpts()
  
  .use (files) ->
    for filename, file of files
      pagin = file.pagination
      if pagin
        links = []

        links.push if pagin.previous
          '<a href="/' + pagin.previous.path + '">&laquo;</a>'
        else
          '<span>&laquo;</span>'

        for page in pagin.pages
          links.push if file == page
            '<span>' + page.pagination.num + '</span>'
          else
            '<a href="/' + page.path + '">' + page.pagination.num + '</a>'

        links.push if pagin.next
          '<a href="/' + pagin.next.path + '">&raquo;</a>'
        else
          '<span>&raquo;</span>'

        pagin.linksHTML = '<p class="pagination">' + links.join('|') + '</p>'

  # CSS AND FINGERPRINTING ####################################################

  .use sass()
  
  .use fingerprint pattern: 'css/main.css'
  
  .use ignore [
    'css/_*.sass'
    'css/main.css'
  ]

  # TEMPLATES #################################################################

  # Custom React templates
  .use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.contents = new Buffer getArticle(file)
    for filename, file of files
      if file.reactTemplate is 'ArticleList'
        file.contents = new Buffer getArticleList(file)

  .use layouts engine: "handlebars", pattern: "**/*.html", default: "wrapper.html"


  # BEAUTIFY ##################################################################
  
  .use beautify {
    wrap_line_length: 100000
    indent_size: 0
  }

  # RSS FEED ##################################################################
  
  .use feed {
    collection: 'posts'
    limit: 20
    destination: METADATA.feedPath
    title: METADATA.title
    site_url: METADATA.url
    description: METADATA.description
  }

  .use (files) ->
    # Make all relative links and images into absolute links and images
    data = files[METADATA.feedPath]
    replaced = data.contents.toString().replace(/(src|href)="\//g, '$1="' + METADATA.url)
    data.contents = new Buffer(replaced)

  # CV PDF ####################################################################

  .use pdf {
    pattern: 'cv/index.html'
    printMediaType: true
    marginTop: '1.5cm'
    marginBottom: '1.5cm'
  }

  # Rename CV to something more meaningful
  .use (files) ->
    oldPath = 'cv/index.pdf'
    newPath = 'cv/david-moody-cv-web-developer.pdf'

    files[newPath] = files[oldPath]
    delete files[oldPath]

  # SERVE AND BUILD ###########################################################

  .use serve()
  .build (err) ->
    throw err if err
    console.log "Metalsmith built in #{new Date() - start}ms"

moment = require 'moment'
Metalsmith = require 'metalsmith'
templates = require 'metalsmith-templates'
permalinks = require 'metalsmith-permalinks'
collections = require 'metalsmith-collections'
dateInFilename = require 'metalsmith-date-in-filename'
pagination = require 'metalsmith-pagination'
serve = require 'metalsmith-serve'
sass = require 'metalsmith-sass'
ignore = require 'metalsmith-ignore'
beautify = require 'metalsmith-beautify'
feed = require 'metalsmith-feed'
fingerprint = require 'metalsmith-fingerprint'
drafts = require 'metalsmith-drafts'
pdf = require 'metalsmith-pdf'

markdown = require './markdown'
excerpts = require './excerpts'

extname = require('path').extname

METADATA =
  title: 'David Moody\'s Blog'
  description: 'A blog about programming'
  url: 'http://davidxmoody.com'
  feedPath: 'feed.xml'
  gitHubURL: 'https://github.com/davidxmoody'
  email: 'david@davidxmoody.com'
  excerptSeparator: '\n\n\n'

isHTML = (file) ->
  /\.html/.test extname(file)

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
    perPage: 6
    template: 'list.html'
    first: 'index.html'
    path: 'page:num/index.html'
    pageMetadata: {}
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

  # Use templates once then once again to wrap every HTML file in wrapper.html

  .use (files, metalsmith) ->
    for file in metalsmith.metadata().posts
      file.template = 'post.html'

  .use templates 'handlebars'
  
  .use (files) ->
    for filename, file of files
      if isHTML(filename)
        file.template = 'wrapper.html'

  .use templates 'handlebars'

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

import getArticle from "./get-article";
import getArticleList from "./get-article-list";

import moment from "moment";
import R from "ramda";

import Metalsmith from "metalsmith";
import autoprefixer from "metalsmith-autoprefixer";
import beautify from "metalsmith-beautify";
import blc from "metalsmith-broken-link-checker";
import collections from "metalsmith-collections";
import dateInFilename from "metalsmith-date-in-filename";
import feed from "metalsmith-feed";
import fingerprint from "metalsmith-fingerprint";
import ignore from "metalsmith-ignore";
import layouts from "metalsmith-layouts";
import pagination from "metalsmith-pagination";
import permalinks from "metalsmith-permalinks";
import sass from "metalsmith-sass";
import sitemap from "metalsmith-sitemap";

import markdown from "./markdown";
import excerpts from "./excerpts";

const METADATA = {
  title: "David Moody's Blog",
  description: "A blog about programming",
  url: "https://davidxmoody.com/",
  feedPath: "feed.xml",
  sitemapPath: "sitemap.xml",
  gitHubURL: "https://github.com/davidxmoody",
  email: "david@davidxmoody.com",
  excerptSeparator: "\n\n\n"
};

const defaultOptions = {
  production: true
};

export default function(options, callback) {

  options = R.merge(defaultOptions, options);

  // CONFIG ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  let m = Metalsmith(__dirname + "/..");
  m.clean(true);
  m.metadata(METADATA);

  // POSTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(function(files) {
      var file, filename;
      for (filename in files) {
        file = files[filename];
        if (file.draft) {
          console.log("Warning: Skipping one draft: " + filename);
          delete files[filename];
        }
      }
    });
  }

  m.use(dateInFilename());

  m.use(function(files) {
    var file, filename;
    for (filename in files) {
      file = files[filename];
      if (file.date) {
        file.formattedDate = moment(file.date).format("ll");
      }
    }
  });

  m.use(collections({
    posts: {
      pattern: "posts/*.md",
      sortBy: "date",
      reverse: true
    }
  }));

  // Convert space separated string of tags into a list
  m.use(function(files) {
    var file, filename;
    for (filename in files) {
      file = files[filename];
      if (file.tags && typeof file.tags === "string") {
        file.tags = file.tags.split(" ");
      }
    }
  });

  // Replace custom excerpt separator with <!--more--> tag before markdown runs
  m.use(function(files, metalsmith) {
    var file, i, len, ref;
    ref = metalsmith.metadata().posts;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      file.contents = new Buffer(file.contents.toString().replace(METADATA.excerptSeparator, "\n\n<!--more-->\n\n"));
    }
  });

  m.use(markdown());

  m.use(permalinks({
    pattern: ":title/"
  }));

  // HOME PAGE PAGINATION ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(pagination({
    "collections.posts": {
      perPage: 5,
      first: "index.html",
      template: "NOT_USED",
      path: "page:num/index.html",
      pageMetadata: {
        rtemplate: "ArticleList"
      }
    }
  }));

  // Don't duplicate the first page
  m.use(ignore(["page1/index.html"]));

  // Clean up paths to provide clean URLs
  m.use(function(files) {
    var file, filename;
    for (filename in files) {
      file = files[filename];
      file.path = filename.replace(/index.html$/, "");
    }
  });

  // EXCERPTS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(excerpts());

  // CANONICAL URLS ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(function(files) {
    var file, filename;
    for (filename in files) {
      file = files[filename];
      file.canonical = METADATA.url + filename.replace(/index.html$/, "");
    }
  });

  // CSS AND FINGERPRINTING ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(sass());
  m.use(autoprefixer());

  m.use(fingerprint({pattern: "css/main.css"}));
  m.use(ignore(["css/_*.sass", "css/main.css"]));

  // TEMPLATES ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.use(function(files, metalsmith) {
    var file, filename, i, len, ref;
    ref = metalsmith.metadata().posts;
    for (i = 0, len = ref.length; i < len; i++) {
      file = ref[i];
      file.contents = new Buffer(getArticle(file));
    }
    for (filename in files) {
      file = files[filename];
      if (file.rtemplate === "ArticleList") {
        file.contents = new Buffer(getArticleList(file));
      }
    }
  });

  m.use(layouts({
    engine: "handlebars",
    pattern: "**/*.html",
    "default": "wrapper.hbs"
  }));

  // BEAUTIFY ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(beautify({
      wrap_line_length: 100000,
      indent_size: 0
    }));
  }

  // SITEMAP ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(sitemap({
      ignoreFiles: [/^CNAME$/, /\.css$/, /\.js$/, /\.jpg$/, /\.png$/],
      output: METADATA.sitemapPath,
      urlProperty: "canonical",
      hostname: METADATA.url,
      modifiedProperty: "modified",
      defaults: {
        priority: 0.5,
        changefreq: "daily"
      }
    }));
  }

  // RSS FEED ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(feed({
      collection: "posts",
      limit: 100,
      destination: METADATA.feedPath,
      title: METADATA.title,
      site_url: METADATA.url,
      description: METADATA.description
    }));

    // Make all relative links and images into absolute links and images
    m.use(function(files) {
      var data, replaced;
      data = files[METADATA.feedPath];
      replaced = data.contents.toString().replace(/(src|href)="\//g, "$1=\"" + METADATA.url);
      return data.contents = new Buffer(replaced);
    });
  }

  // BROKEN LINK CHECKER ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  if (options.production) {
    m.use(blc());
  }

  // BUILD ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  m.build(function(err) {
    callback(err);
  });
};

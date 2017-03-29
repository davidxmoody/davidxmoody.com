---
layout: post.html
title: Building a blog with Metalsmith
date: 2015-02-11
tags: programming, featured
---

I recently transitioned this blog from [Jekyll](http://jekyllrb.com/) to [Metalsmith](http://www.metalsmith.io/). I'm glad I started with Jekyll but I wanted more control. I decided to switch to Metalsmith so that I could write my own build scripts in a language I knew (JavaScript). 

There are *tons* of excellent static site generators available. See [staticsitegenerators.net](https://staticsitegenerators.net/) for a list. I've used [DocPad](https://docpad.org/) before (for the [professorp.co.uk](http://professorp.co.uk/) website). I chose Metalsmith because it offered the most bare-bones setup with minimal restrictions. 

This post will not be a full guide on how to use Metalsmith. I'm assuming that anyone interested in Metalsmith is willing to get their hands dirty. Instead, this post will simply list some of the useful plugins I've come across and some other hacks I've made up. 

<!--more-->

## Paragraph count

In one of my very early posts, I wrote about [paragraph counts in Jekyll](/2014/paragraph-counts-in-jekyll/). I like to have links saying *"Read 15 remaining paragraphs..."* at the end of my excerpts. I think it's better than not giving any information on the length of an article and more useful than giving a raw wordcount. 

Jekyll was rather limited in how it could count paragraphs. I ended up using a pretty awkward Liquid Template hack. Thankfully JavaScript can do much better. Everything after the `<!--more-->` tag is passed through the `paraCount()`  function. It counts everything I feel qualifies as a paragraph including: `<p>`, `<ul>`, `<ol>`, `<pre>` and `<table>` elements.

```js
function paraCount(text) {
  return text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length;
}
```

## Post organisation

I keep all my posts in pretty much the same format as I used with Jekyll. For example:

```bash
src/posts/2014-08-11-hello-world.md
```

I use the handy [metalsmith-date-in-filename](https://github.com/sanx/metalsmith-date-in-filename) plugin to extract the dates. I also use the [metalsmith-permalinks](https://github.com/segmentio/metalsmith-permalinks) and [metalsmith-collections](https://github.com/segmentio/metalsmith-collections) plugins rename and organise posts.

## RSS feed

There's a very handy [metalsmith-feed](https://github.com/hurrymaplelad/metalsmith-feed) plugin for generating RSS feeds from collections. 

It works great although I like to substitute all relative URLs with absolute ones so that they work correctly when viewed in an RSS reader:

```js
  .use(feed({
    collection: 'posts',
    limit: 10,
    destination: 'feed.xml'
  }))
  .use(function(files) {
    data = files['feed.xml'];
    data.contents = new Buffer(data.contents.toString()
        .replace(/(src|href)="\//g, '$1="https://davidxmoody.com/'));
  })
```

## Markdown and Pygments

Jekyll uses [Pygments](http://pygments.org/), a syntax highlighter written in Python. It's pretty good and has support for tons of languages. It also supports the `console` language for mixing in bash prompts with output from commands. I use that in several of my older posts and didn't want to lose it. 

I spent *far too long* hacking together my own Markdown plugin which could do syntax highlighting with Pygments. I ran into a lot of problems with marked and Pygments. The complications arise because Pygments is an external Python library and thus has to be called asynchronously. Marked *does* support this. However, it was tricky to tie it all together. Additionally, both marked and Pygments add in a `<pre>` element wrapping the code and I had to hack together a way to get around having two `<pre>` elements at once.

This blog is currently using Pygments but I regret it. It wasn't worth the effort. I'm even considering going back to [highlight.js](https://highlightjs.org/) for the simplicity and speed improvement.

If you are dead set on using Pygments with Metalsmith then you might want to refer to [this file](https://github.com/davidxmoody/davidxmoody.github.io/blob/f79f9e9088612d5c0c6840268f1bdfb06accd53b/scripts/markdown.js). It is a modified version of the [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) plugin which handles asynchronous Pygments highlighting. 

## Misc

- [metalsmith-each](https://github.com/wilsaj/metalsmith-each) and [metalsmith-ignore](https://github.com/segmentio/metalsmith-ignore) are pretty useful
- I've written about [CSS file hashing](/2015/cloudflare-and-hashed-css/) in a previous post with the [metalsmith-fingerprint](https://github.com/christophercliff/metalsmith-fingerprint) plugin
- I have implemented a basic pagination setup and basic archive page, I plan on doing a better job and writing a full post on them later
- [metalsmith-serve](https://github.com/mayo/metalsmith-serve) is a quick and convenient way to serve your site when testing
- Unfortunately metalsmith-serve doesn't work with [metalsmith-watch](https://github.com/FWeinb/metalsmith-watch) so I use [nodemon](https://github.com/remy/nodemon) to watch for changes and rebuild the site
- I switched from Liquid Templates to [Handlebars](http://handlebarsjs.com/)

## Final thoughts

Overall, Metalsmith is great. It's *supposed* to be extremely simple and rely on plugins to do the heavy lifting. It accomplishes that well. I would happily use it for another project.

My only complaint is that it doesn't do incremental builds. A small change in one post causes a full rebuild with my current setup. It's understandable why Metalsmith doesn't include this (it would be really complex). I may try to implement a custom solution where each individual post is only updated when that post changes but all other files are regenerated every time. 

*[Edit: I recently created created and published my first Metalsmith plugin. It's a plugin to check files for internal broken links. See [this blog post](/2015/publishing-my-first-npm-package/) for how I did it or go straight to the [npm package](https://www.npmjs.com/package/metalsmith-broken-link-checker).]*

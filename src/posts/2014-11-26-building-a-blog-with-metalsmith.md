---
title: Building a blog with Metalsmith
draft: true
---

I recently transitioned this blog from [Jekyll](http://jekyllrb.com/) to [Metalsmith](http://www.metalsmith.io/). I'm glad I started with Jekyll but I wanted more control. I decided to switch to Metalsmith so that I could write my own build scripts in a language I knew (JavaScript). 

There are *tons* of excellent static site generators available. See [staticsitegenerators.net](https://staticsitegenerators.net/) for a list. I've used [DocPad](https://docpad.org/) before (for the [professorp.co.uk](http://professorp.co.uk/) website) and it was pretty good. Other suitable alternatives could have been [Hexo](http://hexo.io/), [Harp](http://harpjs.com/) or [Wintersmith](http://wintersmith.io/). I chose Metalsmith because it offered the most bare-bones setup with minimal restrictions. 

This post will not be a full guide on how to use Metalsmith. I'm assuming that anyone interested in Metalsmith is willing to get their hands dirty. Instead, this post will simply list some of the useful plugins I've come across and some other hacks I've made up. 


## Post organisation

- Date in filename
- Posts collection
- Permalinks

## Simple pagination

Logic in JavaScript not templates, better archive page to follow

## Paragraph count

In one of my very early posts, I wrote about [paragraph counts in Jekyll](/paragraph-counts-in-jekyll/). I like to have links saying *"Read 15 remaining paragraphs..."* at the end of my excerpts. I think it's better than not giving any information on the length of an article and more useful than giving a raw wordcount. 

Jekyll was rather limited in how it could count paragraphs. I ended up using a pretty awkward Liquid template hack. Thankfully JavaScript can do much better. I first discard everything before the `<!--more-->` tag to only count the remaining paragraphs. I then use the following regular expression to match `<p>`, `<ul>`, `<ol>`, `<pre>` and `<table>` elements:

```js
function paraCount(text) {
  return text.match(/<(p|ul|ol|pre|table)>[\s\S]*?<\/\1>/g).length;
}
```

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
    // Make all relative links and images into absolute links and images
    data = files['feed.xml'];
    data.contents = new Buffer(data.contents.toString().replace(/src="\//g, 'src="http://davidxmoody.com/').replace(/href="\//g, 'href="http://davidxmoody.com/'));
  })
```

TODO use new replace version

## Misc

- Ignore and each helpers
- Link to CSS hashing post
- Double template wrapping hack
- Serve
- nodemon watch because other watch broke
- Custom double empty line excerpt separator

Final thoughts: metalsmith great, only part of a larger build process though. 

## Markdown and Pygments

Jekyll uses [Pygments](http://pygments.org/), a syntax highlighter written in Python. I think it's generally considered to be the "best" syntax highlighter available and has support for the most languages. It also supports the `console` language for mixing in bash prompts with output from commands. I have used that in several of my older posts and didn't want to lose it. 

I spent *far too long* hacking together my own Markdown plugin which could do syntax highlighting with Pygments. I ran into so many problems with marked and Pygments. The underlying cause of the problem is that Pygments is an external Python library and thus has to be called asynchronously. Marked *does* support this. However, it was tricky to tie it all together. Additionally, both marked and Pygments add in a `<pre>` element wrapping the code and I had to hack together a way to get around having two `<pre>` elements at once.

This blog is currently using Pygments but I regret it. It wasn't worth the effort. I'm even considering going back to [highlight.js](https://highlightjs.org/) for the simplicity and speed improvement.

If you are dead set on using Pygments with Metalsmith then you might want to refer to [this file](https://github.com/davidxmoody/davidxmoody.github.io/blob/f79f9e9088612d5c0c6840268f1bdfb06accd53b/scripts/markdown.js) which shows a modified version of the [metalsmith-markdown](https://github.com/segmentio/metalsmith-markdown) plugin which handles the asynchronous Pygments highlighting. 

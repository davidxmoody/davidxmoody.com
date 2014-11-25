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

## Markdown and Pygments

Trouble with async, may go back to sync but works for now

## Custom excerpt separator and paragraph count hack

TODO

## RSS feed

Absolute links and images hack

## Misc

- Ignore and each helpers
- Link to CSS hashing post
- Double template wrapping hack
- Serve
- nodemon watch because other watch broke

Final thoughts: metalsmith great, only part of a larger build process though. 

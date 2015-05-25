---
title: Publishing my first npm package
---

I use a lot of great open source software every day. For both work and side projects. 

Although I have released everything I've ever made on [GitHub](https://github.com/davidxmoody), I had never created anything which other people could *actually use*.

I wanted to change that. This is the story of how I published my first npm package and what I learned along the way.


## The problem I wanted to solve

I've been using [Metalsmith](http://www.metalsmith.io/) for a while now. It's a very simple static site generator which uses plugins to do most of the hard work. I wrote a blog post on [how I built this blog with it](/building-a-blog-with-metalsmith/). I have also been using it to build a very large static site at my new job (which I will write about later). 

Sometimes, you can end up with broken links between the pages of your site. By "broken link", I mean a link to another page on your site which does not exist. They can be caused by simple typos or more complex bugs.

With static sites, every single page is generated before you deploy your site. This makes it possible to check all internal links for references to missing pages.

Thus, I decided to create a Metalsmith plugin to help developers catch broken links before it's too late.

## Plan of action

TODO: existing alternatives?

- Must be correct so tests
- Actually used TDD
- How: one correct structure depending on all files, delete files one by one
- Hard because of async plus no changes only errors and working on files not simple inputs
- Mocha/chai good, would use again

## Implementation

I'm not going to an extensive walkthrough of the code. If you are interested, you can [view the source code here](https://github.com/davidxmoody/metalsmith-broken-link-checker/blob/master/src/index.coffee). It's a relatively concise 93 lines of CoffeeScript (with lots of comments and about half of that being taken up by configuration options). 

Here is a quick overview of what the program does:

1. Extract all links in HTML pages with [cheerio](https://github.com/cheeriojs/cheerio). Cheerio is basically jQuery for static content and it works very nicely. 

2. Determine which file in the Metalsmith pipeline should correspond to that link and throw an error if it does not exist. This was a bit harder. I spent about an hour going down dead ends with one URL manipulation library and then trying to write my own. I then found [URIjs](https://www.npmjs.com/package/URIjs) which worked much better. 

3. TODO config options

## Additional options

- Hard to design a great interface (went back and forth between allowEmpty and allowRegex), decided simple is better and only had one

- Writing docs hardest part, done many times before with others (list them?)
- Copied conventions from react plugin

## Npm tips

Here is a quick list of a few useful things I've learned while using npm:

- `npm version 0.1.0` will set the version number in `package.json` as well as commit that change to git and then tag that git commit with `v0.1.0`.

- `npm link` in my project dir then `npm link metalsmith-broken-link-checker` in my blog dir to symlink my link checker as a dependency to my blog. Very useful for testing so you don't have to continuously uninstall and reinstall it.

- `.npmignore` to prevent files from being published by npm and `npm pack` to bundle up everything like it would be when it gets published. Useful to see what files are actually going to get published without having to publish them.

- I was using CoffeeScript but obviously I wanted to compile to JavaScript before publishing. I used the following npm prepublish script in my [package.json](https://github.com/davidxmoody/metalsmith-broken-link-checker/blob/master/package.json) to help with that. I also used a test script to run mocha and then a watch script to automatically watch for changes in my CoffeeScript and run the tests when it detected any changes:

```json
  "scripts": {
    "watch": "coffee --watch -o lib -c src/*.coffee & mocha --watch --compilers coffee:coffee-script/register",
    "test": "mocha --compilers coffee:coffee-script/register",
    "prepublish": "coffee -o lib -c src/*.coffee"
  },
```

## Publishing to npm

Before I published to npm, I first [uploaded it to GitHub](https://github.com/davidxmoody/metalsmith-broken-link-checker). Pretty easy as this was my *seventh* GitHub repo.

I then signed up for npm (again easy). However, I couldn't log in with the command line utility. [According to this post](https://github.com/npm/npm/issues/7876), I was using an older version of npm. No problem, I used npm itself to install the newest version of npm (`npm install -g npm`) and logged in just fine. 

I then published version 0.1.0 without any problems.

## A bonus: My first ever pull request

I realised that I should also get my plugin listed on the official [metalsmith.io](http://www.metalsmith.io/) website. 

I forked the [metalsmith.io repository on GitHub](https://github.com/segmentio/metalsmith.io) and cloned it locally. I made a small change to the JSON list of packaged, committed, pushed and then submitted my first ever pull request. 

Now I've done it, it all seems pretty trivial. However, at the time, it felt like a pretty significant achievement. It was the same for my first GitHub repo and my first blog post. I guess it's just one of those things.

## Three weeks later...

I published the plugin about three weeks ago. 

- 75 per week, 190 total, no signs of slowing
- Most GitHub traffic from npmjs.org
- Full day of dev time worth it? Only barely but learning experience was amazingly worth it, could do it again in half the time
- *First step* on road to becoming an open source contributor

---
title: Publishing my first npm package
date: 2015-05-26
tags: featured
---

I use a lot of great open source software every day. For both work and side projects. 

Although I have released everything I've ever made on [GitHub](https://github.com/davidxmoody), I had never created anything which other people could *actually use*.

I wanted to change that. This is the story of how I published my [first npm package](https://www.npmjs.com/package/metalsmith-broken-link-checker) and what I learned along the way.

<!--more-->

## The problem I wanted to solve

I've been using [Metalsmith](http://www.metalsmith.io/) for a while now. It's a very simple static site generator which uses plugins to do most of the hard work. I wrote a blog post on [how I built this blog with it](/building-a-blog-with-metalsmith/). I have also been using it to build a very large static site at my new job (which I will write about later). 

Sometimes, you can end up with broken links between the pages of your site. By "broken link", I mean a link to another page on your site which does not exist. They can be caused by simple typos or more complex bugs.

With static sites, every single page is generated before you deploy your site. This makes it possible to check all internal links for references to missing pages.

Thus, I decided to create a Metalsmith plugin to help developers catch broken links as soon as possible.

## Plan of action

Before I started on this plugin, I checked to see if anything like it already existed. There are several libraries meant to check live websites sites for external URLs. However, *that's not what I wanted*. I wanted something to check internal relative and root-relative links within a static site *before* it has been deployed.

The main requirement of a project like this is that it actually works *correctly*. That means tests. 

It's an awkward thing to test because Metalsmith runs asynchronously and the only output should be the presence or absence of an error. I used [Mocha](http://mochajs.org/) and [Chai](http://chaijs.com/) to run my tests. I then created a set of Metalsmith source files such that removing any one file would break an internal link. I then looped through, deleting one file at a time and expecting an error to be thrown in each case.

I've written tests before but I have to say I've never found them as useful as with this project. This time, I actually used my tests as the main method for developing my plugin. I always kept one terminal open watching my files and re-running all tests on any change. 

## Implementation

I'm not going to give an extensive walkthrough of the code. If you are interested, you can [view the source code here](https://github.com/davidxmoody/metalsmith-broken-link-checker/blob/master/src/index.coffee). It's a relatively concise 93 lines of CoffeeScript (with lots of comments).

Here is a quick overview of what the program does:

1. Extract all links in HTML pages with [cheerio](https://github.com/cheeriojs/cheerio). Cheerio is basically jQuery for static content and it works very nicely. 

2. Determine which file in the Metalsmith pipeline corresponds to each link and throw an error if the file does not exist. This was a bit harder. I spent about an hour going down dead ends with one URL manipulation library and then trying to write my own. I then found [URIjs](https://www.npmjs.com/package/URIjs) which worked much better. 

3. Provide configuration options. For example, `options.warn` to print errors to the console instead of throwing them. Also the ability to check `src` attributes of `img` tags and the ability to specify a regex of URLs to ignore.

There are also a lot of different edge cases which all add complexity to the program. For example: relative links have to be resolved relative to the file they appear in, hash fragments should be allowed, links to directories containing an `index.html` should be allowed and so on.

Then of course I had to write the README as well. Writing good documentation can often be the hardest part. In many ways though, it's just as important as the code itself so I wanted to do it right. I created an example HTML file showing the different types of links that the plugin recognises and what Metalsmith files they correspond to. 

## Npm tips

Here is a quick list of a few useful things I've learned while using npm:

- I was using CoffeeScript but wanted to compile to JavaScript before publishing. In my [package.json](https://github.com/davidxmoody/metalsmith-broken-link-checker/blob/master/package.json) I have the following prepublish script to do that and also a watch script for development which runs my tests on any change.

```json
{
  "scripts": {
    "watch": "coffee --watch -o lib -c src/*.coffee & mocha --watch --compilers coffee:coffee-script/register",
    "test": "mocha --compilers coffee:coffee-script/register",
    "prepublish": "coffee -o lib -c src/*.coffee"
  },
}
```

- `npm version 0.1.0` will set the version number in `package.json` as well as commit that change to git and then tag that git commit with `v0.1.0`.

- `npm link` in my project dir then `npm link metalsmith-broken-link-checker` in my blog dir to symlink my link checker as a dependency to my blog. Very useful for testing so you don't have to continuously uninstall and reinstall it.

- `.npmignore` to prevent tests and CoffeeScript files from being published by npm. Then `npm pack` to bundle up everything like it would be when it gets published. Useful to see what files are actually going to get published without having to publish them.

## Publishing to npm

Before I published to npm, I first [uploaded it to GitHub](https://github.com/davidxmoody/metalsmith-broken-link-checker). Pretty easy as this was my *seventh* GitHub repo.

I then signed up for npm (again easy). However, I couldn't log in with the command line utility. [According to this post](https://github.com/npm/npm/issues/7876), I was using an older version of npm. No problem, I used npm itself to install the newest version of npm (`npm install -g npm`) and logged in just fine. 

I then published version 0.1.0 without any problems.

## A bonus: My first ever pull request

I realised that I should also get my plugin listed on the official [metalsmith.io](http://www.metalsmith.io/) website. 

I forked the [metalsmith.io repository on GitHub](https://github.com/segmentio/metalsmith.io) and cloned it locally. I updated the JSON list of packages, committed, pushed and then submitted my first ever pull request. 

Now I've done it, it all seems pretty trivial. However, at the time, it felt like a pretty significant achievement. It was the same for my first GitHub repo and my first blog post. I guess it's just one of those things.

## Three weeks later...

I published the plugin about three weeks ago. 

Since then, it's had 190 downloads on npm and 19 visitors to my GitHub repo. Not too bad. 

Was it worth it? This project took me slightly more than a full day to implement. Realistically, the amount of time my plugin will save other people will only barely be worth the amount of time it took me. 

But in terms of *my experience*, it has been worth it a hundred times over. 

The idea of creating a useful open source project used to feel like a significant milestone for me. Now I've done it once, I feel like I could do it again in half the time. I feel like this was only the first step on my road to becoming an open source contributor. 

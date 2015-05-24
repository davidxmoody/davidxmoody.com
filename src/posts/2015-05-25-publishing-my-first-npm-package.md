---
title: Publishing my first npm package
---

I use a lot of great open source software every day. For both work and side projects. 

Although I have released everything I've ever made on [GitHub](https://github.com/davidxmoody), I had never created anything which other people could *actually use*.

I wanted to change that. This is the story of how I published my first npm package and what I learned along the way.


## The problem I wanted to solve

I've been using [Metalsmith](http://www.metalsmith.io/) for a while now. It's a very simple static site generator which uses plugins to do most of the hard work. I wrote a blog post on [how I built this blog with it](/building-a-blog-with-metalsmith/). I have also been using it to build a very large static site at my new job (which I will write about later). 

Sometimes, you can end up with broken links between pages of your site. By "broken link", I mean a link to another page on your site which does not exist. They can be caused by simple typos or more complex bugs.

With static sites, every single page is generated before you deploy your site. This makes it possible to check every single internal link to see if any reference another page which does not exist.

Thus, the problem I wanted to solve was help developers catch any broken links as easily as possible before they deploy their site.

TODO: get "make a metalsmith plugin" in there somewhere

## Implementation

For this project, the most important 

TODO: existing alternatives?

- Cheerio (extremely easy and reliable)
- URIjs after other failed lib plus own attempt (lesson: look for others first, don't reinvent the wheel)
- Must be correct so tests
- Actually used TDD
- How: one correct structure depending on all files, delete files one by one
- Hard because of async plus no changes only errors and working on files not simple inputs
- Mocha/chai good, would use again

- Hard to design a great interface (went back and forth between allowEmpty and allowRegex), decided simple is better and only had one

- Writing docs hardest part, done many times before with others (list them?)
- Copied conventions from react plugin

- Npm tips: 
    - Npm version (used at work *tons*)
    - Npm link (ditto at work)
    - Go over prepublish script plus watch script for development
    - Npm ignore plus npm pack for testing

## Publishing to npm

- GitHub repo first (easy)
- Signed up for npm and published (easy)
- Metalsmith.io pull request

## Three weeks later...

I published the plugin about three weeks ago. 

- 75 per week, 190 total, no signs of slowing
- Most GitHub traffic from npmjs.org
- Full day of dev time worth it? Only barely but learning experience was amazingly worth it, could do it again in half the time
- *First step* on road to becoming an open source contributor

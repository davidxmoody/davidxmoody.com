---
title: Publishing my first npm package
---

I use a lot of great open source software every day. For both work and side projects. 

Although I have released everything I've ever made on [GitHub](https://github.com/davidxmoody), I had never created anything which other people could *actually use*.

I wanted to change that. This is the story of how I published my first npm package and what I learned along the way.

TODO put in a direct link to npm/GitHub here


## The problem I wanted to solve

I've been using [Metalsmith](http://www.metalsmith.io/) for a while now. It's a very simple static site generator which uses plugins to do most of the hard work. I wrote a blog post on [how I built this blog with it](/building-a-blog-with-metalsmith/). I have also been using it to build a very large static site at my new job (which I will write about later). 

Sometimes, you can end up with broken links between pages of your site. By "broken link", I mean a link to another page on your site which does not exist. They can be caused by simple typos or more complex bugs.

With static sites, every single page is generated before you deploy your site. This makes it possible to check all internal links for references to missing pages.

Thus, the problem I wanted to solve was to help developers catch broken links as easily as possible. I decided to do it by creating an easy to use Metalsmith plugin which could be put at the end of a Metalsmith pipeline and warn developers before it was too late.

## Implementation

The plugin has to do two main things:

1. Extract all links in HTML pages
2. Determine which file in the Metalsmith pipeline should correspond to that link and throw an error if it does not exist

For the first, I decided to use [cheerio](https://github.com/cheeriojs/cheerio). It's basically jQuery for static content. I've used cheerio a bit more since then and I have to say it's very nice. I was simply able to load cheerio with the contents of each HTML file and use a jQuery like selector to find all links and extract their href attributes. 

For the second, I had a few more problems.

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

Before I published to npm, I first uploaded it to GitHub. Pretty easy as this was my *seventh* GitHub repo.

I then signed up for npm (again easy). However, I couldn't log in with the command line utility. [According to this post](https://github.com/npm/npm/issues/7876), I was using an older version of npm. No problem, I used npm itself to install the newest version of npm (`npm install -g npm`) and logged in just fine.

- Signed up for npm and published (easy)
- Metalsmith.io pull request

## A bonus: My first ever pull request

I realised that I should also get my plugin listed on the official [metalsmith.io](http://www.metalsmith.io/) website. 

I forked the [metalsmith.io repository on GitHub](https://github.com/segmentio/metalsmith.io) and cloned it locally. I made a small change to the JSON list of packaged, committed, pushed and then submitted my first ever pull request. 

Now I've done it, it all seems pretty trivial. However, at the time, it seemed like a pretty significant achievement. It was the same for my first GitHub repo and my first blog post. I guess it's just one of those things.

## Three weeks later...

I published the plugin about three weeks ago. 

- 75 per week, 190 total, no signs of slowing
- Most GitHub traffic from npmjs.org
- Full day of dev time worth it? Only barely but learning experience was amazingly worth it, could do it again in half the time
- *First step* on road to becoming an open source contributor

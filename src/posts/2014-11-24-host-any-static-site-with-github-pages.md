---
title: Host any static site with GitHub Pages
---

[GitHub Pages](https://pages.github.com/) is pretty awesome. It provides free, no-hassle hosting for static sites. I hosted this blog with it for three months using Jekyll to build the site. 


Although it's awesome, it's also a bit limiting. Jekyll is great but there is a lot it can't do. For example, while Jekyll "supports" tags, you can't create a page to list all posts with a given tag. At least not without using a plugin which GitHub Pages won't do.

There is an easy way around this. You can build the site locally (using any plugins or code you want) and still host it on GitHub Pages. It's pretty simple although there are still a few caveats. 

## Raw HTML should go in master

For a user site (e.g. [davidxmoody.github.io](http://davidxmoody.com/)), GitHub expects the raw HTML/CSS/JavaScript to be placed in the root of the master branch. (Project sites should have the raw HTML in the gh-pages branch.)

Additionally, if you have a custom domain name, the `CNAME` file must also go in the root of master. It's not that important but you do have to make sure that the `CNAME` file gets copied across to you build directory when you build your site. 

It's very slightly awkward to get this all to work. There are two options that I can find.

## Option one: two local repos

One approach is to have two separate repositories on your development machine. One for the actual source and one for the generated site. See [this blog post](http://charliepark.org/jekyll-with-plugins/) for a rough guide. 

It's acceptable and can be scripted. I don't really like it though.

## Option two: filter the source branch

The other option is a bit more complex and requires a bit of Git hacking. 

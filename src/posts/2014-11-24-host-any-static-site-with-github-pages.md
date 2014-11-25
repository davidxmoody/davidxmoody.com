---
title: Host any static site with GitHub Pages
---

[GitHub Pages](https://pages.github.com/) is pretty awesome. It provides free, no-hassle hosting for static sites built with [Jekyll](http://jekyllrb.com/). However, it also has some limitations.

For example, although Jekyll "supports" tags, you can't create pages to list all posts with a given tag. At least not without using a plugin, which GitHub Pages doesn't allow.

There is an easy way around this. You can build the site locally (using any plugins or code you want) and still host it on GitHub Pages. It's pretty simple although there are a few caveats. 


## Generated HTML should go in master

For a user site (e.g. [davidxmoody.github.io](http://davidxmoody.com/)), GitHub expects the generated HTML/CSS/JavaScript to be placed in the root of the master branch. *(Project sites should use the gh-pages branch.)*

Additionally, if you have a custom domain name, the `CNAME` file must also go in the root of master. It's only a minor point but you do have to make sure that the `CNAME` file gets copied across to you build directory when you build your site. 

It's slightly awkward to get this all to work. I wanted a way to have both the source and generated site available on GitHub in the same repository. There are a few options available.

## Option one: Two local repos

One approach is to have two separate repositories on your development machine. One for the actual source and one for the generated site. See [this blog post](http://charliepark.org/jekyll-with-plugins/) for a rough guide. 

The idea is that you keep the source in one repository and then copy across the generated site the other and commit it. You can then push the built repository to the master branch and the other repository to a "source" branch on GitHub. 

It's acceptable and can be scripted. I don't really like it though.

## Option two: Filter the source branch

The next option is a bit more complex and requires a bit of Git hacking. Read [this post](http://davidensinger.com/2013/04/deploying-jekyll-to-github-pages/) for more details.

The idea is that you commit all source and generated files to a branch named "source". You then delete the master branch and recreate it by filtering to only include the history of the `_site` directory (and also move it to the root of the project). 

Here's the script:

```bash
git branch -D master
git checkout -b master
git filter-branch --subdirectory-filter _site/ -f
git checkout source
git push --all origin
```
I used this solution for about two weeks after finding it. It's okay but still not great. The thing I don't like about it is that it feels like a lot of work has to be done every time you want to publish changes. You have to delete the *entire* master branch and recreate the whole thing. 

You also have to actually switch branches in the working directory which is awkward. It interferes with your static site generator if it's watching for changes. It also feels like a lot of unnecessary file copying for the hard drive. 

## Option three: Subtree push

This third option is actually something I discovered myself. Well, I didn't exactly create the whole thing from scratch but I did manage to piece it all together without following a specific guide. 

It solves most of the problems with the above options in the most concise way I can think of. You don't have to have multiple branches on your filesystem at the same time, you also don't even have to switch branches at any point. 

Here's the script:

```bash
git subtree push --squash --prefix _site/ . master
git push --all origin
```

1. The `git subtree` command splits apart changes from different filesystem subtrees
2. The `--prefix _site/` option specifies that everything under the `_site` dir should be split
3. The `--squash` option specifies that any commit which doesn't change anything in `_site` should be ignored (not strictly necessary)
4. The `push` command and `. master` tell Git to push those changes to the master branch in the current repository (assuming you are currently in a branch called source)
5. `git push --all origin` then tells Git to push both branches to GitHub

It's the simplest option I can think of and I'm pretty happy with it. It does feel a bit messy to have to have both generated files and source files in the same source branch. I'm sure there are ways around it but I like this approach for its simplicity. 

## Set the default branch

One last tip. You probably won't want to display the raw HTML of your generated site to people visiting your GitHub repository. 

You can fix that simply by going to the Settings for your repository and changing the default branch from master to source. 

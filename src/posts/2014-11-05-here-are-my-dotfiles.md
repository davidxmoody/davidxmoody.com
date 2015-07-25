---
title: Here are my dotfiles
date: 2014-11-05
tags: bash, featured
---

I've recently been uploading a lot of my old projects to GitHub. There is only one left: **my dotfiles**.


You can [view them on GitHub](https://github.com/davidxmoody/dotfiles). I wanted to upload them because I think there are a few interesting fragments in there. Someone might find something they need. It also makes it easier for me to clone them from another machine, should the need ever arise. 

There are about 200 commits, spanning three years. I don't pretend to be an expert in these things but I still feel my dotfiles reflect a lot of experience over that time.

It's slightly messy at the moment. I would like to organise them better someday. I recently found [GitHub does dotfiles](http://dotfiles.github.io/). It has some very interesting links to other dotfile repositories and frameworks. 

In the rest of this post, I am going to highlight a few of the most interesting things in my dotfiles.

## `mkalias`

I have [already written a blog post on this function](/permanent-bash-aliases/) which you should check out. The gist of it is that it takes too long to open up your `.bash_aliases` file just to create a new alias. My simple Bash function works just like the normal `alias` command except it makes the alias "permanent" by placing it into your aliases file. 

```bash
mkalias() {
  # Flatten arguments into one string
  local full_string=$*

  # Extract the first and last parts
  local alias_name=${full_string%%=*}
  local alias_result=${full_string#*=}

  # Construct the new command
  local alias_command="alias $alias_name='$alias_result'"

  # Execute the command, if successful then print 
  # out the alias and add it to ~/.bash_aliases
  eval "$alias_command" && \
  alias "$alias_name" | tee -a "$HOME/.bash_aliases"
}
```

## JPEG metadata stripping and resizing

When you take a photo, a lot of extra data is created. Stuff like the date, camera model, exposure and whatnot. However, when you are creating a website, there is no point downloading all that data along with the image. It can often take up around 20KB of extra space. 

I use this handy `stripjpg` alias to strip out all Exif data. I also use `convert` to downscale images to 800px wide (for this blog). It's not a perfect responsive image setup but it works for now. 

```bash
alias stripjpg='exiftool -all= '
resize800() {
  stripjpg "$@" && \
  for f in "$@"; do
    convert "$f" -resize 800x "$f"
  done
}
```

## Word frequency script

A little something I created when I wanted to find the number of occurrences of common words in a large corpus of text split across multiple files. 

```python
#!/usr/bin/env python3

from collections import Counter
import fileinput

word_tallies = Counter()

for line in fileinput.input():
    word_tallies.update(line.split())

for word, count in word_tallies.most_common(2000):
    print(count, word)
```

## Vim writing tricks

Again, I have already written about [Vim auto-capitalisation](/vim-auto-capitalisation/) and [better Vim abbreviations](/better-vim-abbreviations/). 

Two months later, I still love them both. They both save me several minutes daily. Not having to press the shift key so much also makes my little fingers very happy. 

## `home-setup` script

I've gone through some very complex and messy dotfile setups in the last three years. I finally settled upon a very simple script. It simply symlinks everything in `dotfiles` to my home directory. 

It also appends a dot to the names (because I don't like hidden files in a project directory specifically meant for dotfiles). Additionally, it backs up anything that was already in my home directory with the same name (but avoids creating backed up duplicate links).

```bash
for file in dotfiles/*; do
    target="$HOME/.${file#dotfiles/}"
    target_canon=$(readlink -f "$target")
    file_canon=$(readlink -f "$file")
    [ "$target_canon" = "$file_canon" ] && continue
    ln -sbv "$file_canon" "$target"
done
```

## Tons of short aliases

There are too many to go over and most aren't that novel. However, they all represent small time and effort savings which quickly add up. Here is a small sample.

```bash
alias  ls='ls -F --group-directories-first --color=auto'

greppy() { grep -n "$1" *.py; }
grepc() { grep -n "$1" *.coffee; }

alias up='cd ..'
alias cdt='cd ~/tmp'
cdl() { cd "$@" && l; }
mkcd() { mkdir "$@" && cd "$@"; }

alias vimrc='vim ~/.vimrc'
alias vba='vim ~/.bash_aliases'

alias gs='git status'
alias gc='git commit'
alias gl='git log'

alias jeks='jekyll server --watch --port 4000 --drafts'
alias simplehttp='python -m SimpleHTTPServer'

alias py='python3'
alias pyi='python3 -i'

alias op='xdg-open'
```

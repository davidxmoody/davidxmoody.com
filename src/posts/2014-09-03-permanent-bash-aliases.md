---
title: Permanent Bash aliases
date: 2014-09-03
tags: Bash
---

This post will introduce a handy little Bash tip. I created it over a year ago but many other people have already done similar things.

Bash aliases are incredibly convenient. If, for some reason, you don't already use them then you should [read this tutorial](https://www.digitalocean.com/community/tutorials/an-introduction-to-useful-bash-aliases-and-functions). 


Anyway, on to the function:

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

This allows you to create a "permanent" alias which gets added to your `~/.bash_aliases` file. It has a few other features. It prints out the alias (as interpreted by Bash) so you can check that nothing went wrong. It also allows you to omit quotes in many circumstances. 

```bash
mkalias hello=echo hello world  # Quotes optional
#=> alias hello='echo hello world'

hello
#=> hello world

RC_DIR=~/sync/dotfiles

mkalias cdrc=cd $RC_DIR  # Probably wrong
#=> alias cdrc='cd /home/david/sync/dotfiles'

mkalias cdrc='cd $RC_DIR'  # Should be quoted
#=> alias cdrc='cd $RC_DIR'

mkalias lsl='ls | less'  # Must be quoted
#=> alias lsl='ls | less'

bash  # Open new shell

hello  # Alias is remembered
#=> hello world
```

The function can still fail if you use the wrong syntax (e.g. by putting whitespace around the `=` character). It would also be nice to find a way to share aliases between *already running Bash instances*. 

One final tip, if you create an alias that "overwrites" another command, you can precede it with a backslash to run the original command.

```bash
mkalias ls=ls -CF
#=> alias ls='ls -CF'

ls  # Notice trailing slashes on directories
#=> CNAME       _config.yml  _ideas.md  _posts/  _site/  feed.xml  index.html
#=> README.md   _drafts/     _layouts/  _sass/   css/    images/

\ls  # Regular ls behaviour
#=> CNAME      _config.yml  _ideas.md  _posts   _site  feed.xml  index.html
#=> README.md  _drafts      _layouts   _sass    css    images
```

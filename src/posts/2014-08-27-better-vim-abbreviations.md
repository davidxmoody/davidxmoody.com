---
title: Better Vim abbreviations
tags: Vim
---

I've been using Vim, full-time, for nearly three years. I have written *a lot* of plain text in that time. 

Pretty early on, I noticed I was wasting a lot of time with several common typing patterns. For example, to type "I've" requires 5 key strokes including two stretches of the little fingers. I replaced that with the abbreviation `iab iv I've`. That's only two keys instead of five and it doesn't put any unnecessary stress on the little fingers (which I sometimes have problems with). 


I created several other abbreviations for common typing patterns (mostly avoiding having to type apostrophes and capital letters). Here is a small sample:

```vim
iab i I
iab iv I've
iab il I'll
iab dont don't
iab monday Monday
iab february February
iab cof CoffeeScript
```

I keep these English-only abbreviations in a separate file (`~/.vim/abbreviations.vim`) which gets sourced when editing Markdown or text files. 

Some people also like to add common typos to their list of abbreviations. I have a few of those but I like to keep them to a minimum. When possible, I prefer to force myself to re-type the word correctly so that I learn the proper spelling. 

## Annoyances

This worked well for me for a long time but it had two problems that kept bugging me. One was that I had to manually add the capitalized versions of all my abbreviations. For example, `iab cant can't` as well as `iab Cant Can't`. This duplication of information was annoying and felt messy. 

The other problem was that it was a pain to add new abbreviations. I had to manually open up my abbreviations file every time. 

I was about to start creating my own script to deal with this stuff. Thankfully, one already exists. 

## Abolish plugin

The [Vim Abolish plugin](https://github.com/tpope/vim-abolish) is pretty neat. Read the tutorial for a full walkthrough of the features. It lets you do stuff like this:

```vim
Abolish seperate separate
" Results in:
iabbrev seperate separate
iabbrev Seperate Separate
iabbrev SEPERATE SEPARATE
```

It has more advanced features which allow you to group together related words:

```vim
Abolish cal{a,e}nder{,s} cal{e}ndar{}
```

Also, if you place a `!` at the end, you can add words to you abbreviations file easily:

```vim
" In ~/.vim/abbreviations.vim (or where-ever you like)

" `expand('<sfile>:p')` gets the absolute path of the 
" current file that this is being executed from
let g:abolish_save_file = expand('<sfile>:p')

if !exists(":Abolish")
  finish
endif

" Typing `:Abolish! im I'm` will append the following
" to the end of this file:
Abolish im I'm
```

There is also a `Subvert` command for doing similar things in search and replace:

```vim
" Will replace "Facilities" with "Buildings", etc.
:%Subvert/facilit{y,ies}/building{,s}/g
```

Again, check the [GitHub repo](https://github.com/tpope/vim-abolish) for more details. I haven't been using the plugin for long but I really like it so far. 

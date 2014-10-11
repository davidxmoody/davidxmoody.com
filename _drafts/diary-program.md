---
layout: post
title: Lessons learned from a three year programming project
---

TODO add github link, say what the project actually *is*

For the last three years, I have been working on a little pet project. It has probably taught me more about software development than my entire time at university. Instead of covering every little detail of the project, I'm going to go through a few of the most important lessons it has taught me. 


## Early stages: Bash is really powerful

About four years ago, I started keeping a diary. Initially, I just wrote in a single text file. It was nice and simple and easy. After a few months, the file got a bit big and it was impossible to find anything. I also had problems with Dropbox syncing clashes. I experimented for a while keeping separate files but it was still really awkward to find anything. 

Then, three years ago, I started learning [Bash](http://en.wikipedia.org/wiki/Bash_(Unix_shell)). Bash is incredibly powerful. I kind of take it for granted now but back then, something as simple as [grepping](http://en.wikipedia.org/wiki/Grep) for keywords in multiple files was a revelation. 

I started experimenting with all kinds of ad-hoc scripts. I had a script to search for keywords and hashtags, a script to do a wordcount and a script to manage files and create new entries. I eventually settled on a new file format with one file per entry and the date embedded into the filename. 

All this time, I was learning about some incredibly useful command line tools. I was searching with `grep`, displaying results with `less`, doing wordcounts with `wc`, writing in `vim`, formatting and parsing dates with `date`, handling output redirection with pipes and doing lots of other stuff. 

However, my scripts just kept growing and growing. They reached about 800 lines of code at their maximum. There was a lot of repeated code shared within the files for manipulating dates and looping through all entries. 

Lesson 1: TODO

## Version control

My very early versions of the program were a complete mess. I had scripts stored in many different directories and dotfiles over several different computers which I was manually synchronising every time I made a change. 

One particular incident really opened my eyes. I was in the midst of implementing a big new feature. However, it was taking longer than I wanted and I had to leave it to go do something in the real world. I didn't have a chance to get back to it for several days. By then, I had kind of forgotten what I was working on so I delayed finishing it even longer. However, my partial modifications had broken my scripts. I could no longer view or edit my diary. I think I had to resort to just using a plain text file like I had when I first started writing. 

If I had been using version control, I could have simply reverted my changes. 

TODO fix the above, maybe focus on dev/stable divide instead and making changes to live data

## Python is awesome

My Bash scripts were becoming unwieldy. I was interested in learning a new programming language and Python 3 seemed like the ideal choice. For a short while, I was completely obsessed with Python. I read everything I could and practised on [Project Euler](https://projecteuler.net/) problems. 

I loved everything about Python. I slowly started re-writing my Bash scripts. Initially, I just replaced the `#!/bin/bash` with `#!/usr/bin/env python3` and re-wrote my scripts in a similar style. I later refactored a bit and used a proper Python module layout. 

TODO, mention generators, pipes

Lesson: TODO

## How not to do caching

I had just read about Python decorators and the pickle module. I wanted to try them out.

I noticed that a lot of duplicated work was being done every time entries were being shown to the user. The text wrapping had to be re-calculated every time. I naively decided to try and save this work from having to be done every time. 

I designed a very elaborate caching decorator function. It took the entry to be displayed and the line-width and returned a list of strings wrapped to the appropriate width. Additionally, it cached the result in a pickled file for future reference (once for every different line-width).

Perhaps predictably, my implementation was pretty bad. It took me a little while to realise but opening up the pickled file and reading back the list of wrapped strings actually took *longer* than opening the text file and wrapping it again. 

Lesson: TODO premature optimisation is bad

## Abstraction and small methods

This lesson was something I learned slowly over the course of the project. I always "knew" the advantages of hiding implementation details in small methods and creating classes for abstract concepts. I had been taught it in university after all. 

However, when it came to actually write code, I consistently ended up with massive functions and huge amounts of duplicated code. In my early Bash scripts for example, I had copy-pasted the code for iterating over all entries about 5 different times. 

It took a while for me to intuitively understand the concepts but I very slowly got better. In my early versions, every single file depended on the exact same filesystem layout. In my current version, every single file depends on one `Entry` class. That class could change the filesystem layout any time it wants and it wouldn't affect anything else. It could switch to a database or a remote filesystem or anything and none of the other modules would really be affected. 

It seems *obvious* now. However, at the time, it took me a long time to internalise what these vague concepts actually meant in terms of a real program. 

Lesson: TODO abstraction, small methods, single responsibility, DRY, find better terminology

## CLI and polish

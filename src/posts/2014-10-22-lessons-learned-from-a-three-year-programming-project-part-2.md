---
title: Lessons learned from a three year programming project (part 2)
date: 2014-10-22
tags: featured
---

Continued from [part 1](/lessons-learned-from-a-three-year-programming-project-part-1/). You can also [view the project on GitHub](https://github.com/davidxmoody/diary).


## Abstraction and small methods

This lesson was something I learned slowly over the course of the project. I always "knew" the advantages of hiding implementation details in small methods. I had been taught it in university after all. 

However, when it came to actually writing code, I consistently ended up with massive unreadable functions. In my early Bash scripts for example, I had copy-pasted the code for iterating over all entries about *five different times*.

It took a while for me to *intuitively understand* the concepts but I slowly got better. In my early versions, every single script depended on the exact same filesystem layout. In my current version, every single file depends on one `Entry` class which has many smaller methods. That class could change the filesystem layout any time it wants and it wouldn't affect anything else. It could switch to a database or a remote filesystem and none of the other modules would notice.

The [don't repeat yourself](http://en.wikipedia.org/wiki/Don't_repeat_yourself) principle (and its various corollaries) feels so *obvious* now. However, in practice, it still took me a long time to actually get to grips with what it really meant.

**Lesson 4:** Don't repeat yourself. 

## CLI and polish

Later on in development, I started thinking of new features to add. After creating the [professorp.co.uk](http://professorp.co.uk/) website, I became interested in making a "local web app". It would be a complete browser-based replacement for the command line app. 

I experimented with using Markdown conversion to create static HTML pages. I then created a working Flask RESTful API for manipulating entries as well as a very basic AngularJS web client. 

I eventually decided to scrap those ideas. There were an infinite number of features that I *could* add. However, they would all be a lot of work for little benefit. I realised I should focus on doing one thing and doing it well (the [Unix philosophy](http://en.wikipedia.org/wiki/Unix_philosophy)). 

I cleaned up the code even more and implemented a complete [argparse](https://docs.python.org/3/library/argparse.html) command line parser. It ties together all the basic features of the program. It also adds enough documentation so that anyone could figure out how to use it. 

I did eventually adapt my previous ideas and implement a better static HTML generator. It allows things like pictures and videos to be embedded in entries. Its features slightly overlap with the basic command line functionality but not by as much. 

**Lesson 5:** Write programs that do one thing and do it well.

## Future plans

I'm very proud of my current diary program. I use it literally every single day. If I want to find out about some event that happened two years ago then I can often do it in a couple of seconds. 

In some ways, my constant [dogfooding](http://blog.codinghorror.com/the-ultimate-dogfooding-story/) has resulted in a very high quality program. However, in another way, it's probably doomed it to obscurity. The structure of the program is very closely tied to how I like to work. Although it's perfect for me, someone else might find it pointless or hard to use.

For the last three years, I have kept the project to myself. I have only just [uploaded it to GitHub](https://github.com/davidxmoody/diary).

I guess time will tell whether anyone else is interested. Who knows, maybe it will become just as popular as [Todo.txt](http://todotxt.com/) but I somehow doubt that. 

The point I'm trying to make is that I should have sought external feedback much earlier. The project is mostly finished now. I don't expect to make many major changes. If I had gotten feedback earlier in development then I may have learned some useful information about what others wanted and how to improve the project. 

**Lesson 6:** Release often and early.

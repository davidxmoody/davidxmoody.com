---
layout: post
title: Lessons learned from a three year programming project (part 2)
---

Continued from [part 1](/lessons-learned-from-a-three-year-programming-project-part-1/). 


## Abstraction and small methods

This lesson was something I learned slowly over the course of the project. I always "knew" the advantages of hiding implementation details in small methods and creating classes for abstract concepts. I had been taught it in university after all. 

However, when it came to actually write code, I consistently ended up with massive functions and huge amounts of repeated code. In my early Bash scripts for example, I had copy-pasted the code for iterating over all entries about 5 different times. 

It took a while for me to intuitively understand the concepts but I slowly got better. In my early versions, every single script depended on the exact same filesystem layout. In my current version, every single file depends on one `Entry` class. That class could change the filesystem layout any time it wants and it wouldn't affect anything else. It could switch to a database or a remote filesystem and none of the other modules would notice.

It seems *obvious* now. It still took me a long time to internalise what these vague concepts actually meant in terms of a real program. 

**Lesson 4:** TODO abstraction, small methods, single responsibility, DRY, find better terminology (add links)

## CLI and polish

Later on in the development of the project, I added a complete [argparse](https://docs.python.org/3/library/argparse.html) command line parser. 

TODO delete above line? Or move later on

I also experimented with using Markdown conversion on the text entries to create HTML pages for easier browsing. I briefly created a working Flask RESTful API for accessing the entries. I also created a very basic AngularJS web client for viewing and editing entries. It was all early prototype stages and not ready for proper use. 

Eventually, I scrapped those and implemented a decent static HTML generator. In many ways, it's very similar to any other static website generator. It does incremental builds when entries change. 

I realised that there was an infinite number of features that I *could* add to the program. However, they would all be a lot of work for little gain. 

**Lesson 5:** TODO be good at one thing only

## Future plans

I'm very proud of my current diary program. I've 

TODO [dogfooding](http://blog.codinghorror.com/the-ultimate-dogfooding-story/) link

**Lesson 6:** TODO Release early

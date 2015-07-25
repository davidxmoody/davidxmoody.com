---
title: Lessons learned from a three year programming project (part 1)
date: 2014-10-15
---

For the last three years, I have been working on a little pet project. It has probably taught me more about software development than my entire time at university. 

It's a command line program for writing and organising a personal diary ([GitHub link](https://github.com/davidxmoody/diary)). I've spent hundreds of hours on it and have gone through many different designs. Instead of covering every little detail of the project, I'm going to write about some important lessons it has taught me. 


## Bash is really powerful

I started keeping a diary about four years ago. Initially, I just wrote in a single text file. It was nice and simple and easy. After a few months, the file got a bit big and it was impossible to find anything. I experimented with splitting it into multiple files but that just made the problem worse.

Then, three years ago, I started learning [Bash](http://en.wikipedia.org/wiki/Bash_(Unix_shell)). Bash is incredibly powerful. I take it for granted now. At the time, something as simple as [grepping](http://en.wikipedia.org/wiki/Grep) for keywords in multiple files was a revelation. 

I started experimenting with all kinds of ad-hoc scripts. I had a script to search for keywords, a script to do a wordcount and a script to create new entries. I eventually settled on a new file format with one file per entry and the date embedded in the filename. 

All this time, I was learning about some incredibly useful command line tools:

- `grep` to search
- `less` to display results
- `wc` to do a wordcount
- `vim` to edit entries
- `date` to format and parse dates
- `fmt` to wrap text
- And many more...

However, my scripts just kept growing and growing. They reached about 800 lines of code at their maximum. There was a lot of repeated code and other poor design decisions. 

I used many elaborate work-arounds to attempt to fix some of the problems with Bash. However, the lack of proper data-structures really hurt. So did the inability to properly share information between scripts. 

Although I don't regret starting off with Bash, I should have realised that it just wasn't suitable for such a large project. 

**Lesson 1:** Choose the right language for the job. 

## Version control

My very early attempts were a *complete mess*. I had scripts stored in multiple different directories and dotfiles and my changes frequently broke stuff.

Thankfully, I found this [excellent Hg Init tutorial](http://hginit.com/). Even though I'm now switching to [Git](http://git-scm.com/), I still love [Mercurial](http://mercurial.selenic.com/). I learned the basics and continuously practised them. 

Although I had *technically* been using Mercurial in university, it had always been a chore. I felt like it was something I was supposed to do and I used it grudgingly. This time, I actually understood what was going on and enjoyed using it. 

Even though I was using version control, I was still making one big mistake. I was directly symlinking to my scripts for everyday use. This meant that whenever I was in the process of making changes, I completely broke my ability to use my diary normally. 

One particular incident really opened my eyes. I was in the process of changing the file storage format. I was changing each file to be stored in a month-based subdirectory as opposed to one big directory. I had manually migrated my data to the new format and was in the process of re-writing my scripts. 

Unfortunately, it took rather longer than expected. For almost a week, I had to manually type in the filenames for new entries. This taught me to separate my wild refactoring attempts from my working stable scripts. It also taught me to keep a separate set of "test entries" for use with that development branch. 

I eventually read [this great article on source control](http://thedailywtf.com/Articles/Source-Control-Done-Right.aspx). I adopted the "branching by exception" strategy and haven't looked back since. 

**Lesson 2:** Keep development and stable branches separate.

## Python is awesome

My Bash scripts were becoming unwieldy. I was interested in learning a new programming language and Python 3 seemed perfect. For a short while, I was completely obsessed with Python. I read everything I could and practised on [Project Euler](https://projecteuler.net/) problems. 

I slowly started re-writing my Bash scripts one at a time. Once I had removed all traces of Bash, I switched to a proper Python module design. I made countless changes over a long period of time. I loved all the features of Python which Bash didn't have (like [generators](https://wiki.python.org/moin/Generators), [modules](https://docs.python.org/3.4/tutorial/modules.html) and proper [classes](https://docs.python.org/3.4/tutorial/classes.html)).

I noticed that a lot of duplicated work was being done when formatting entries. The text wrapping had to be re-calculated every time. I had recently read about Python [decorators](http://stackoverflow.com/questions/739654/how-can-i-make-a-chain-of-function-decorators-in-python/1594484#1594484) and the [pickle](https://docs.python.org/3.4/library/pickle.html) module. I naively tried to use them to solve the problem.

I designed a very elaborate caching decorator function. It took a long time to write and debug but it did work. However, I had made a big error in judgement. For the text wrapping, I had inherited the rather lazy design of calling the `fmt` command line program from within Python. This was very slow. I later implemented text wrapping with the [textwrap](https://docs.python.org/3.4/library/textwrap.html) module which was about an order of magnitude faster. 

With the faster text wrapping method, my caching was now *slower* than re-wrapping the text each time. I didn't like to do it but I eventually stripped out all caching behaviour, making the basic display functionality nearly instant. At least I had learned how to use decorators and the pickle module. 

**Lesson 3:** Premature optimisation is bad.

[Read part 2...](/lessons-learned-from-a-three-year-programming-project-part-2/)

---
layout: default
title: CV
permalink: /cv/
---

# David Moody -- Web developer

- Email: <david@davidxmoody.com>
- Blog: [davidxmoody.com](http://davidxmoody.com/)

## Education

### Christ's College, Cambridge (2008 - 2011)

- B.A. Computer Science (2:1)

### Strode College (2006 - 2008)

- Maths (A)
- Further Maths (A)
- Physics (A)
- Chemistry (A)
- Biology (A)

## Recent projects

### [professorp.co.uk](http://professorp.co.uk) (2013 - 2014)

- Website for the Professor P series of children's books
- Five JavaScript games written with **AngularJS**, **jQuery** and **CoffeeScript**
- AI opponent in one of the games uses the **A* search algorithm**
- Experience with **Node.js**, **Gulp** and **Browserify**
- **Responsive design** with **Bootstrap** and **Sass**
- Generated with **DocPad**, **Markdown** and **Eco templates**
- Working Amazon S3 deployment script (unused) and FTP deployment script
- Worked with the author to create the content of the site
- 280 commits, [available on GitHub](https://github.com/davidxmoody/professorp.co.uk)

### [davidxmoody.com](http://davidxmoody.com/) (2014)

{% assign num_posts = site.posts | size %}
{% assign num_words = 0 %}
{% for post in site.posts %}
  {% assign post_words = post.content | number_of_words %}
  {% assign num_words = num_words | plus: post_words %}
{% endfor %}

- My personal blog
- Static site generated with **Jekyll** and hosted with **GitHub Pages**
- Simple responsive design and typography with **Sass**
- {{ num_posts }} posts ({{ num_words }} words) written since 11 August 2014 on a **regular&nbsp;schedule**
- I have written about: Vim plugins, website design, the Pomodoro Technique, misc tech stuff and almost everything else on this CV
- Over 160 commits, [available on GitHub](https://github.com/davidxmoody/davidxmoody.github.io)

### Monte Carlo Tree Search in Texas Hold 'em Poker (2011)

- 3rd year dissertation project written in **Java**
- Built a **working poker-bot** with a complex AI search algorithm

### Project Kilo: recognising molecules from photographs (2010)

- Second year university group project
- **Worked with others** to create an Android app and server
- Created a large part of the front-end Android application

### Edubase web scraper (2011)

- Simple web scraper written in Java using regular expressions
- Exports schools' contact info to a database, saving a lot of time for a small publishing company

### Diary program (2011 - 2014)

- 3 year personal project written in **Bash** and then **Python**
- Learned many Python features including: generators, regular expressions, file manipulation, module structure, decorators, subprocesses, logging, etc.
- Over 330 commits, [available on GitHub](https://github.com/davidxmoody/diary)
- Implemented a basic **Flask RESTful API** and later a static HTML generator using **Jinja2** templates

### Linux and other skills

- **Mercurial** user (2011 - 2014), now learning **Git**
- Knowledge and experience with many **Unix command line tools**
- **Fast typist** with Dvorak and Vim (~80wpm)

## Interests

- [Skilled croquet player](/my-experiences-playing-croquet/), my team has won *four South West league finals* in the last two years
- Amateur photographer
- Amateur chef 

## References

Available on request

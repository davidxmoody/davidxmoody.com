---
layout: page.html
title: CV
---

# David Moody - Web developer

- Email: <david@davidxmoody.com>
- GitHub: [github.com/davidxmoody](https://github.com/davidxmoody)
- Blog: [davidxmoody.com ](https://davidxmoody.com/ )
- LinkedIn: [linkedin.com/in/davidxmoody/](https://www.linkedin.com/in/davidxmoody/)

## About me

TODO

- Looking for interesting/meaningful work with opportunities to learn and help people
- Strong academic background
- Can work effectively by myself
- Interested in web technologies

## Technical skills

- Languages: **JavaScript** (**Node.js**), **Bash**, **Python**, **CoffeeScript**, **Java**
- Front-end: **React**, **Redux**, **CSS modules**, **Sass**, **Webpack**, **jQuery**, some **React Native**
- Other tools: **Git**, **Vim**, **tmux**, and many other **Unix command line tools**

## Education

### Christ's College, Cambridge (2008 - 2011)

- B.A. Computer Science (2:1)

### Strode College (2006 - 2008)

- Maths (A)
- Further Maths (A)
- Physics (A)
- Chemistry (A)
- Biology (A)

## Experience

### Software Engineer at Momentum Financial Technology (March 2015 - present)

- Joined as the sole engineer on a project to redesign a consumer finance website (yourwealth.co.uk)
    - Worked in a small team with designers, content writers and a digital marketer for 3 months
    - Created a static site (built with Metalsmith) with content hosted on a cloud-based CMS (Prismic)
    - Worked on various small financial tools/calculators built in React
    - Worked with the designers to write the Sass styles for the project
- Created a life-insurance quote comparison tool using a third party API
    - It consisted of a complex form, results view, lightweight proxy backend and basic Intercom integration
    - Built with React, Redux, Sass
- Created an "investment options tool" for helping first-time investors decide what to do
    - Featuring a force-graph based layout and "zoomable" UI
    - Built with React, Redux, SVG and some basic maths for zooming/panning
    - I later gave a lightning talk on the project at BristolJS
- Switched to another team helping to build a larger single page Redux app to help financial advisers share information with their clients (Moneyhub Connect)
    - My team did significant work to improve the existing Bootstrap-based UI
    - I introduced two big new technologies into the project: CSS modules (to replace Sass) and React Storybook (a dev tool)
    - We also worked to integrate the search feature of an financial adviser database
- The company went through a restructure and I temporarily moved back to the original team
    - I helped migrate yourwealth.co.uk to a new domain momentum.co.uk
    - I converted the entire project from CoffeeScript to JavaScript and changed hosting from Amazon S3 to Netlify
    - I also helped hire two new developers
- Moved back to the other side of the business to work on the consumer app Moneyhub
    - We started off with a 5-day Design Sprint to try and figure out how to get new users engaged with the app
    - We implemented a major new feature, a new homescreen with springy cards to give insights about the user's data
    - Spent time implementing new features, improving existing ones and fixing bugs in the app
    - Worked with React, Flux, Sass/inline-styles and canvas
    - Also spent some time working on our backend code (Docker, Node.js, Express, Postgres, Mongo)
- The app used to use Cordova but an effort had already been made to migrate to React Native
    - The iOS build worked but the Android one did not
    - I got it working and released it to the Google Play Store
    - I later integrated the AppsFlyer SDK (an analytics platform) and added server-side event tracking
- I went with five other people from the company to take part in the Pensions Dashboard Techsprint event in London (run by the HM Treasury)
    - We worked for two days to create a new prototype for the upcoming pensions dashboard
    - We had also previously held an internal 3-day Design Sprint based around visualising pension data (I created some graphs inspired by Bret Victor's Ladder of Abstraction concept)
- I also took an interest in our git repositories while working at the company
    - I created a project that gathered all of the package.json files from all of our repos (using BitBucket's API) and could tell you which projects depended on which other ones
    - I introduced fit-commit to the team (a Ruby tool for validating git commit messages) and later ported it over to JavaScript so that it could be more easily automated (using an npm git hook tool called husky)
    - I also created various scripts for mass cloning and updating repos for the team

## Meetups and conferences

I have attended and helped out at a lot of local Bristol tech meetups over the last 2 years:

- In April 2016, I gave a lightening talk at **BristolJS** demonstrating my zoomable investment tool
- In July 2016, I gave a full talk at **BristolJS** on Redux
- Since August 2016, I have been running the **CodeHub Hack Nights** at the Momentum offices every two weeks (although to be fair, it involves little beyond being there and locking up afterwards)
- We also organised two git workshops at our offices
- I've been to a lot of other meetups in Bristol including **BristolJS**, **Bristech**, **Bristol Web Perf** and others
- I went to the **Simpleweb** Future of Chat hack day (and won a prize for a Slack-based git stats chatbot)

I've been to the following conferences over the last two years:

- Bristech 2016
- FullStack London 2016
- Bristech 2017
- Pixel Pioneers Bristol 2017
- FullStack London 2017 (upcoming)

## Projects

### [davidxmoody.com](https://davidxmoody.com/) (2014 - present)

- Personal blog documenting some of my past projects
- 46 posts (36,000 words)
- Simple static website built with Metalsmith, hosted on Netlify

### [metalsmith-broken-link-checker](https://github.com/davidxmoody/metalsmith-broken-link-checker) (2015 - present)

- Plugin for the static site generator Metalsmith
- Aims to check all internal links for references to files that do not exist
- Is moderately well used by other people, has received 6 pull requests and 14 stars on GitHub

### [My dotfiles](https://github.com/davidxmoody/dotfiles) (2011 - present)

- I have been using Vim inside the terminal for a very long time
- I use Bash, Git, Vim, tmux, ag and fzf a lot
- The repo represents 400+ commits worth of config and hacks
- I also type with the programmer Dvorak keyboard layout

### [Life calendar](https://github.com/davidxmoody/life-calendar) (2015 - present)

- A visualisation of all the weeks in my lifetime
- Originally based on an idea from a Wait But Why blog post, it has gone through many iterations since
- I use it as a bit of a playground for new ideas, in the past it has been rendered with React, Nunjucks and a zoomable canvas

### [Decaffeination scoreboard](https://github.com/davidxmoody/dotfiles/blob/master/bin/decaf-scoreboard) (2017)

- A hacky bash script to encourage my team to convert our CoffeeScript codebase to JavaScript
- It looked through the git history and counted the number of times someone deleted a CoffeeScript file and added a JavaScript file with the same name

### [professorp.co.uk](http://professorp.co.uk) (2013 - 2014)

- Website for the Professor P series of children's books
- Includes games and activities for children and details about the books and events
- Five JavaScript games written with **AngularJS**, **jQuery** and **CoffeeScript**
- Built with **Node.js**, **DocPad**, **Browserify**, **Markdown** and more
- Basic responsive design with **Bootstrap** and **Sass**
- I later split the wordsearch game into a separate repo and helped somebody integrate it into their language learning site

### [Diary program](https://davidxmoody.com/2014/lessons-learned-from-a-three-year-programming-project-part-1/) (2011 - 2014)

- Command line program for organising a personal diary
- Three year side project written in **Bash** and re-written in **Python**

### [Monte Carlo Tree Search in Texas Hold 'em Poker](https://davidxmoody.com/2014/mcts-in-texas-hold-em-poker-a-retrospective/) (2011)

- Third year dissertation project written in **Java**
- Built a **working poker-bot** with a complex AI search algorithm

### Edubase web scraper (2011)

- Simple web scraper written in Java using regular expressions
- Exports schools' contact info to a database, saving a lot of time for a small publishing company

### Project Kilo: recognising molecules from photographs (2010)

- Second year university group project
- Worked in a small team, I was responsible for the Android app part of the project

## Other interests

- Running, I run around the Bristol Harbourside regularly and I completed the Great Bristol 10K in 51 minutes
- I've played a lot of [competitive croquet](https://davidxmoody.com/2014/my-experiences-playing-croquet/)
- [Photography](https://davidxmoody.com/2014/my-10-best-tenerife-photos/)
- [Cooking](https://davidxmoody.com/2014/20-of-my-favourite-cooking-photos/)

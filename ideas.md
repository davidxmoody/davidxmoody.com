# Post ideas

## Quick tech tips

- Tip to use beautify with zero indent and infinite line length as an alternative to html minification
- Extract information from Jekyll-like filenames and put it into the file: `for f in 20*; do d=$(echo $f |grep -oP '\d{4}-\d\d-\d\d'); sed -i "/title:/a\date: $d" $f; done`
- Adding Git branch to Bash prompt, and whether or not the current branch has been pushed to origin

## Small projects

- Use my metalsmith-broken-link-checker as a standalone static site checker (with a one step metalsmith build process)
- Use Digital Ocean machine for something interesting
- Quick idea to conveniently extract query string options with defaults and node fallback
- Try <https://github.com/feross/standard> as an alternative to eslint
- Idea for alternative to immutable data structures with Redux: simply check that the entire state has not changed in dev mode before doing the next reduce

## Large projects

- Make and publish a Vim auto-capitalisation plugin
- Sync the state of any app with text files via sockets, allow both reading and writing from that file, could use bash scripts to quickly replace the file with another and so on, enable Vim to auto-reload the file on any change to "watch" the state of the app
- Game idea: Tetris game with letters as blocks, valid words get removed 
- Game idea: Text based adventure which also teaches JavaScript techniques
- Redux real time playback of actions
- Make a better script for committing a directory to a git branch using git 2.5 <https://github.com/blog/2042-git-2-5-including-multiple-worktrees-and-triangular-workflows>

## Write about existing experience

- From ES5 to CoffeeScript and back to ES6 again
- "Lesser known ES6 features" from the ebook
- "Idea for a static site generator that I will never implement", idea for purely React based SSG, it progressively enhances images and transitions between pages, it generates an endpoint for each terminal page but uses push state for faster page transitions, in dev mode it only writes out changes to the files that have actually changed
- Different ways to embed static apps into static websites: e.g. my old Professor P way of doing it then the render server and client side methods and finally my new idea: provide the module exports as being one main executable function (it accepts options and outputs it's own html, scripts, styles and a list of files with paths), would allow publishing to npm
- Idea for file watcher that outputs a single object of all files (same references if unchanged) on any file change, then use pure memoized functions to build a static site and pair with a file writer that only writes changes when necessary, go from that to a Redux style static site generator
- Growth mindset part 3
- Write about fzf and ranger scripts

## Things to learn about then write about

- Try Vim Easymotion
- Finish reading about Material UI
- Ramda command line tool
- Try <https://libraries.io/npm/super-react>
- Find a tool for capturing gifs of webpages for bug reports 
- Try typescript

## Reviews of existing projects

- Write about ideas/implementation of standalone wordsearch game (or update old post with iframe)
- Lessons learned from building the Professor P website
- YourWealth retrospective (mortgages, life insurance, decision tree)

# Content experiment ideas

- Put links to my most recent posts/relevant posts at the bottom of all of my posts
- Try *asking* for GitHub stars in relevant posts?

# Blog tweaks

- Add comments (Discourse)
- Add about-me page
- Change background colour of code elements
- Reduce text size on mobile devices
- Favicon <http://realfavicongenerator.net/>
- Tag explorer page
- Change email on home page to use obfuscated email (or put it somewhere else)
- Custom 404 page, make it do JavaScript redirects to other pages when I specify a redirect slug in a post's metadata
- Better header with more links to important pages (do NOT use a hamburger menu)
- Asynchronous "load more" button for pagination
- Make deployment script add the current source commit hash in the commit message
- Flowcharts on my blog? <https://github.com/adrai/flowchart.js>

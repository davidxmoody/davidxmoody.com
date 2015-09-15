# Post ideas

## Quick tech tips

- Tip to use beautify with zero indent and infinite line length as an alternative to html minification
- Extract information from Jekyll-like filenames and put it into the file: `for f in 20*; do d=$(echo $f |grep -oP '\d{4}-\d\d-\d\d'); sed -i "/title:/a\date: $d" $f; done`
- Adding Git branch to Bash prompt, and whether or not the current branch has been pushed to origin
- BEM classnames npm package(s)

## Small projects

- Git commit hook to make sure your commit messages are in imperative mood
- Use my metalsmith-broken-link-checker as a standalone static site checker (with a one step metalsmith build process)
- Use Digital Ocean machine for something interesting
- Try using https://github.com/purifycss/purifycss on my blog
- Create a Ramda "deep where" function
- Create open source logarithmic React sliders
- Quick idea to conveniently extract query string options with defaults and node fallback

## Large projects

- Make and publish a Vim auto-capitalisation plugin
- Sync the state of any app with text files via sockets, allow both reading and writing from that file, could use bash scripts to quickly replace the file with another and so on, enable Vim to auto-reload the file on any change to "watch" the state of the app
- Game idea: Tetris game with letters as blocks, valid words get removed 
- Game idea: Text based adventure which also teaches JavaScript techniques
- Redux real time playback of actions

## Write about existing experience

- From ES5 to CoffeeScript and back to ES6 again
- "Lesser known ES6 features" from the ebook
- Pagination number logic
- Pros and cons of using react templates for rendering to static markup (or try deku!)
- "Idea for a static site generator that I will never implement", idea for purely React based SSG, it progressively enhances images and transitions between pages, it generates an endpoint for each terminal page but uses push state for faster page transitions, in dev mode it only writes out changes to the files that have actually changed
- Different ways to embed static apps into static websites: e.g. my old Professor P way of doing it then the render server and client side methods and finally my new idea: provide the module exports as being one main executable function (it accepts options and outputs it's own html, scripts, styles and a list of files with paths), would allow publishing to npm

## Things to learn about then write about

- Git branching strategies and rebasing
- Go through Vim plugins top list (nerdtree, ctrlp, easymotion)
- Switch to tmux
- Try zsh or fish
- Try Facebook's Path Picker tool
- Do anything to try out neural networks
- Finish reading about Material UI
- Flexbox
- `jq` command line tool

## Updates to old posts

- Update "Big list of blogs I like"
- Growth mindset part 3

## Reviews of existing projects

- Write about ideas/implementation of standalone wordsearch game
- Lessons learned from building the Professor P website

# Content experiment ideas

- Put CTAs or links to my most recent posts/relevant posts at the bottom of all of my posts

# Blog tweaks

- Add comments (Discourse)
- Add about-me page
- Change background colour of code elements
- Reduce text size on mobile devices
- Favicon (http://realfavicongenerator.net/)
- Tag explorer page
- Change email on home page to use obfuscated email (or put it somewhere else)
- Custom 404 page, make it do JavaScript redirects to other pages when I specify a redirect slug in a post's metadata
- Better header with more links to important pages (do NOT use a hamburger menu)
- Asynchronous "load more" button for pagination

# Ideas for helper scripts

- Create new blog post (based on title, defaults to today's date and being a draft and no tags)
- Edit most recently edited blog post (or most recent blog post by date or most recent draft)
- Publish a post (remove draft: true, set date to today's date, commit to git with convenient message)
- Make deployment script create a Git tag with a deployment "ref"

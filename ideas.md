# Post ideas

## Quick tech tips

- Tip to use beautify with zero indent and infinite line length as an alternative to html minification
- Extract information from filenames and put it into the file: `for f in 20*; do d=$(echo $f |grep -oP '\d{4}-\d\d-\d\d'); sed -i "/title:/a\date: $d" $f; done`
- Adding Git branch to Bash prompt, also whether or not the current branch has been pushed to origin
- Lots of different tips on new ES6 features I didn't know about before

## Small projects

- Write a script to measure my time spent typing per day
- Git commit hook to make sure your commit messages are in imperative mood
- Use my metalsmith-broken-link-checker as a standalone static site checker (with a one step metalsmith build process)
- Use Digital Ocean machine for something interesting
- Try using https://github.com/purifycss/purifycss on my blog

## Large projects

- Contribute to existing popular open source libraries
- Make and publish a Vim auto-capitalisation plugin
- Sync the state of any app with text files via sockets, allow both reading and writing from that file, could use bash scripts to quickly replace the file with another and so on, enable Vim to auto-reload the file on any change to "watch" the state of the app
- Game idea: Tetris game with letters as blocks, valid words get removed 
- Game idea: Text based adventure which also teaches JavaScript techniques

## Write about existing experience

- From ES5 to CoffeeScript to ES6
- "Lesser known ES6 features" from the ebook
- Pros and cons of using react templates for rendering to static markup
- Write post about pagination number logic
- "Idea for a static site generator that I will never implement", go over the idea for my purely React based SSG which progressively enhances images and transitions between pages and generates an endpoint for each terminal page but uses push state for faster page transitions and also incrementally updates only the pages necessary using internal DOM writing to files not the real DOM. Reason for not implementing it is that it is overkill for a static site. It is too much work for simple page transitions. Tries to re-implement what the browser does. Too much complexity. Only writing about it to try and get it out of my head. 
- Different ways to embed static apps into static websites. For example my old Professor P way of doing it then the render server and client side methods and finally my new idea: provide the module exports as being one main executable function, it accepts options and outputs it's own html, scripts, styles and a list of files with paths. Allows for greater flexibility within each module but less reuse also allows for publishing directly to npm so you can have a prepublish step. 

## Things to learn about then write about

- Git branching strategies and rebasing
- Go through Vim plugins top list (nerdtree, ctrlp, easymotion)
- Switch from Terminator to tmux
- Try zsh
- Try Facebook's Path Picker tool
- Do anything to try out neural networks
- Finish reading about Material UI
- Flexbox

## Updates to old posts

- Update "Big list of blogs I like" post

## Reviews of existing projects

- Write about ideas/implementation of standalone wordsearch game
- Lessons learned from building the Professor P website

## Personal opinions

- Write about how I feel about my repos getting GitHub issues or stars
- About me: "Primal success story" (with photos)
- Write growth mindset post part 3

# Content experiment ideas

- Compare pagination buttons vs a "load more" button which loads more on the same page
- Put CTAs or links to my most recent posts/relevant posts at the bottom of all of my posts
- Put tags under articles and create listing pages for tags

# Blog tweaks

- Add comments (Disqus)
- Add about-me page
- Change background colour of code elements
- Reduce text size on mobile devices (and in general?)
- Favicon (http://realfavicongenerator.net/)
- Tags (actually use them)
- Change email on home page to use obfuscated email (or use separate contacts page)
- Custom 404 page, make it do JavaScript redirects to other pages when I specify a redirect slug in a post
- Better header with more links to important pages
- Start a new Vim spell file specific to my blog (and move it into my dotfiles)

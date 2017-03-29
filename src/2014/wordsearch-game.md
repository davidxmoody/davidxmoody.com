---
layout: post.html
title: Wordsearch game
date: 2014-08-18
tags: programming, featured
---

For my first post not about blogging, I thought I would return to my wordsearch game. I made it for the [professorp.co.uk](http://professorp.co.uk/games/wordsearch/) website and I would say it's the game I'm proudest of. I really like the simplicity and style of it. 

In this post, I will take a look back at what I've already done and make a note of what I think could be improved. In subsequent posts, I plan to make some improvements and also make it into a standalone game.

<!--more-->

*[Update on 2016-01-31: Thanks to Mikhail, this game has been adapted for the language learning site [Internet Polyglot](http://www.internetpolyglot.com/). See [here](http://www.internetpolyglot.com/word_search_game?lessonId=-2104301155) and [here](http://www.internetpolyglot.com/word_search_game?lessonId=-4602101160) for examples.]*

## The game

You can play it [right now](http://professorp.co.uk/games/wordsearch/) but in case you don't want to, here is a screenshot:

![Screenshot of the wordsearch game](/images/2014/wordsearch-game/wordsearch-screenshot.png)

I had recently played [this Android wordsearch game](https://play.google.com/store/apps/details?id=com.melimots.WordSearch&hl=en) and liked the visual style of it. I wanted to make something similar but add my own touches. 

I went through quite a lot of iterations of this game. Originally I made it using CoffeeScript and jQuery. Some time later, I started learning AngularJS and decided it would be a good exercise to re-write it. Later still, I realised I had to actually integrate it into the Professor P website. I made sure everything worked well with DocPad (the static site generator I was using). I also added some Bootstrap styles to some of the elements.

It's actually a very complex game. Going through every line of code would be rather tedious. Instead I'm going to pick out a few of interesting design decisions and examine them further. 

## Grid generation

My algorithm for generating the wordsearch grid basically comes down to the following steps:

1. Choose a random word
2. Choose a random starting position and direction
3. Attempt to place the word into the grid at that position, if that won't work because of a conflicting word then do nothing
4. Repeat 1-3 a bunch of times
5. Fill in the rest with random letters

In practice there are a bunch of other minor details: For example, I found that by choosing a truly random starting direction for each word, almost all of the words ended up in the same direction. Sometimes all horizontally and sometimes all vertically but rarely an even mixture. I felt this made for a bit of an unsatisfying game; it was just too easy to find subsequent words after you had spotted the pattern. 

This happened because once the first few words had been placed, it became much harder for words in a perpendicular direction to be placed into the grid without conflict (relative to parallel words).

I fixed that problem by forcing the "random" directions to be distributed evenly. A list of all eight directions was shuffled at the start. Words were only allowed to move on to a new direction after a successful fit. Overall, this worked very well.

Another small detail is how to choose the random words. Again, I found that by choosing truly random words, the grid tended to fill up with many smaller words because those were least likely to cause conflicts. While not a huge problem, I felt the game was more fun with a mix of long and short words. To fix this, I simply forced longer words to be tried before shorter words. 

I created several other abstractions to reason about grid but I am not going to write about everything here. If you are interested you can read the [source code on GitHub](https://github.com/davidxmoody/professorp.co.uk/tree/master/src/documents/games/wordsearch), it comes with an [MIT license](https://github.com/davidxmoody/professorp.co.uk/blob/master/LICENCE.md).

## Colour highlighting

I made things difficult for myself when I was designing how the game should look. I wanted some very specific things:

1. Grid cells under the cursor should glow
2. The currently selected path should glow
3. If the currently selected path is over a correct word then it should glow stronger
4. Once a correct word has been found then it should stay highlighted
5. After finding a word, the active colour should cycle to the next in the sequence
6. Overlapping highlights should blend nicely

I took a long time tweaking everything but I think it works well. I had recently read [this article on a game design concept called juiciness](http://codeincomplete.com/posts/2013/12/11/javascript_game_foundations_juiciness/) and the [video it links to](https://www.youtube.com/watch?v=Fy0aCDmgnxg). I wanted to make it very clear what was currently selected and give some positive feedback when a correct word was found.

I used JavaScript to listen for mouse events and update the classes. I then used some clever scss for changing colours and opacities. For the persistent highlights, some new empty div elements are added to the cells. They are absolutely positioned and sized to overlap perfectly with their parent cell. Their partial opacity takes care of the blending. 

## Level progression

This is something that could be improved further. Currently, when you finish the level you get a JavaScript alert saying "Congratulations". You can then select a different difficulty level from the menu to play again. I think this is one of the weaker areas of the game and needs to be improved. 

I can think of a few possibilities:

- **Timer:** Each attempt is timed, try to beat your previous best (also some kind of high-score table)
- **Time limit:** Stage is failed unless it is completed within a certain time
- **Large grid, time limit:** Huge grid with tons of words and a small time limit, find as many as you can instead of trying to find them all
- **Multiple stages:** Next stage only unlocked upon completion of the previous one, try to complete all stages

The simple timer approach sounds like the easiest to implement (and has been used in similar games before). A local high-score table would be required to give context to each individual attempt. The others would be interesting but riskier. The advantage of the timer approach is that it requires virtually no extra balancing. You are always competing against your past self so there is always going to be a challenge. 

## Technical issues

There are a few other things I would like to tweak:

- Very very occasionally (~1/100 times) the grid will have five or fewer words on it, the grid should be regenerated in the event that this happens
- Although the game is perfectly playable on mobile devices, the juicy colour styles don't work very well as you can't drag your finger
- The grid gets a bit squashed when you have a 10x10 grid on a small screen

## Conclusion

This post introduced one of my previous projects. Although there are plenty of existing HTML wordsearch games available, none of them have quite the visual style that mine does. I am pleased with it. 

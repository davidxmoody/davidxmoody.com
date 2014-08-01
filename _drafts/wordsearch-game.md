---
layout: post
title: Wordsearch game
---

For my first proper post, I thought I would return to my wordsearch game. I made it for the [professorp.co.uk](http://professorp.co.uk/games/wordsearch/) website and I would say it's the game I'm proudest of. I really like the simplicity and style of it. 

In this post I will take a look back at what I've already done and make a note of what I think could be improved. In subsequent posts I will make some improvements and also make it into a standalone game which can exist outside of the Professor P website. 

## The game

You can play it [right now](http://professorp.co.uk/games/wordsearch/) but in case you don't want to, here is a screenshot:

![Screenshot of the wordsearch game](/images/2014-08-04/wordsearch-screenshot.png)

I had recently played [this Android wordsearch game](https://play.google.com/store/apps/details?I'd=com.melimots.WordSearch&hl=en) and liked the visual style of it. I wanted to make something similar but add my own touches. 

I went through quite a lot of iterations of this game. Originally I made it using CoffeeScript and jQuery. Some time later, I started learning Angular.js and decided it would be a good exercise to re-write it. Later still, I realised I had to actually integrate it into the Professor P website. I made sure everything worked well with DocPad (the static site generator I was using) and changed some of the other elements to use the existing Bootstrap styles from the website.

It's actually a very complex game. I'm not going to do a complete walkthrough of every line of code. Instead I'm going to pick out a handful of interesting design decisions and examine them further. 

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

I am pleased with the abstractions I created to reason about grid but I am not going to write about everything here. If you are interested you can read the [source code on GitHub](https://github.com/davidxmoody/professorp.co.uk/tree/master/src/documents/games/wordsearch), it comes with an [MIT licence](https://github.com/davidxmoody/professorp.co.uk/blob/master/LICENCE.md).

## Colour highlighting

I made things difficult for myself when I was designing how the game should look. I wanted some very specific things:

1. Grid cells under the cursor should glow
2. The currently selected path should glow
3. If the currently selected path is over a correct word then it should glow stronger
4. Once a correct word has been found then it should stay highlighted
5. After a word has been found the colour should change
6. Overlapping highlights should blend nicely

I implemented this by having one colour class on the grid itself to represent the current active colour. I then set classes on the cells in JavaScript whenever the mouse moved and the path information needed to be updated. 

Persistent highlights were implemented with separate div elements inside the cells. They have the same size as the parent cell and are absolutely positioned to overlap perfectly. I would have preferred a way to blend colours using CSS classes alone but that doesn't seem to be possible at the moment. 

I also added some CSS background transitions to make it feel a bit smoother. 

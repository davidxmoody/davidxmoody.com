---
layout: post.html
title: Creating a style for this blog
date: 2014-08-13
tags: programming, featured
---

I didn't want to use an existing template for this blog. As a web programmer/designer, it would feel wrong not to make my own. 

However, I'm not an artist. I've struggled with creating visually attractive content in the past. For my last project, [professorp.co.uk](http://professorp.co.uk/), I opted to use the default Bootstrap theme. I just wanted to get something up and running quickly.

This post will describe some of the things I've learned while creating this blog. 

<!--more-->

## Great artists steal

I'm reasonably confident in my ability to implement any given design with CSS/HTML. However, as I've discovered, *implementing* a given design requires *having* a design first.

It's a trap I've fallen into far too often. I spend twenty minutes implementing some layout, getting all the elements to be perfectly centered or aligned. Then I step back to look at it and realise I don't like it at all. 

For this blog, I'm completely ripping off many design elements from another blog by [Tommy John Creenan](http://tommyjohncreenan.com/). I really liked the header design and simple colour scheme of his site. *[Edit: his site has completely changed design since I wrote this.]*

Like his header, mine features my own name in large capitals with a drop shadow and then a subtitle below. 

## Colours

I did want my own colour scheme though. Alas, choosing a colour scheme is no simple task. I used the excellent website [paletton.com](http://www.paletton.com/) to choose [this colour scheme](http://www.paletton.com/#uid=1000u0kleqtbzEKgVuIpcmGtdhZ) from the presets. 

I copy-pasted the RGB codes into my Sass variables. This way, I can change my colour scheme very easily (as long as I don't want to go beyond a simple monochromatic scheme).

```scss
$color-base: #D34747;
$color-light: #F57373;
$color-lighter: #FFA3A3;
$color-dark: #B52626;
$color-darker: #8F0C0C;
```

## Sticky footer

I wanted a footer in a similar style to the header. A banner of colour with some simple text. That wasn't too tricky and I also decided to put a Creative Commons license in there too. 

I didn't like how it floated half way up shorter pages though. A footer half way up the page isn't really a footer after all. 

I used [this tutorial by Ryan Fait](http://ryanfait.com/html5-sticky-footer/) to achieve that. It makes the markup look a bit cluttered but it's good enough for now. I don't have many short pages anyway so I may investigate removing or changing this in the future. 

## Typography

Most of the stuff on this blog is going to be text so it's pretty important not to screw it up. 

I'm already using [normalize.css](http://necolas.github.io/normalize.css/) on this blog and I was interested to find out if there was something similar for laying out text. There kind of is with [typebase.css](http://devinhunt.github.io/typebase.css/). I tried it out but did not like the default settings at all. The headers appeared *way* too big for one thing. I played around with the settings but still did not like it that much. 

There is also [Typeplate](http://typeplate.com/) which is similar in its goals. I tried that out too but again, the default settings looked very bad in my opinion. It also seemed needlessly complex and I decided I wanted something simpler. I did like the tutorial on the home page however. One thing I took from it was to not use the blackest colour for the text. I now use `#111` for headings and `#222` for body text. 

I also found [another handy tutorial on creating a typographic boilerplate](http://webdesign.tutsplus.com/articles/a-web-designers-typographic-boilerplate--webdesign-15234). It contained a lot of useful information and the thing I really took from it was that there is no single standard, you just have to use what works for you. 

## Gridlover

After some more searching, I found [Gridlover](http://www.gridlover.net/). It's based around the idea of laying out text such that it aligns to an (imaginary) evenly spaced grid. It comes with an [incredibly useful app](http://www.gridlover.net/app/) which allows you to set the font size, line height and scale factor on a visual grid.

I'm not completely sold on this whole grid idea. For one thing, I notice that most other sites do not align with any kind of grid. Despite that, it's still pretty good and I decided to use it for my blog. 

At first I simply copy-pasted the generated settings from the Gridlover app. It worked but it also felt very messy. Changing any of the variables would require opening my browser, re-entering the variables, copying the generated CSS and then figuring out exactly what I had to replace in my source files. 

Thankfully, a better solution already exists: [a Gridlover Mixin on GitHub](https://github.com/sevenupcan/gridlover-mixin). Documentation isn't great but I was able to figure it out eventually. There is one file called [rhythm.sass](https://github.com/sevenupcan/gridlover-mixin/blob/master/sass/rhythm.sass) which I copied directly into my Jekyll `_sass` directory. It contains a `rhythm` mixin which accepts three arguments. The first is the number of times the scale factor will be multiplied to the font size to produce the new font size. The second and third are the number of empty lines you want before and after the element. You can then `@include` the rhythm mixin in any other element. Here is an example of how it could be done:

```scss
// Gridlover variables go here
$body-font-size: 18px;
$body-line-height: 1.5;
$scale-factor: 1.414;
$computed-line-height: $body-line-height * $body-font-size;

// Import the rhythm mixin
@import 'rhythm';

// Paragraphs and lists will not be scaled 
// and will have one empty line after
p, ul, ol {
  @include rhythm(0, 0, 1);
}

// Level 1 headers will be scaled up three times,
// have two empty lines before and one after
h1 {
  @include rhythm(3, 2, 1);
}

// Level 2 headers will be scaled up two times, 
// have one empty line before and one after
h2 {
  @include rhythm(2, 1, 1);
}

// And so on for the other headers...

// Also include this bit for sanitation of a 
// few other elements
hr {
  border: 1px solid;
  margin: -1px 0;
}
ul ul, ol ol, ul ol, ol ul {
  margin-top: 0;
  margin-bottom: 0;
}
b, strong, em, small, code {
  line-height: 1;
}
sup, sub {
  vertical-align: baseline;
  position: relative;
  top: -0.4em;
}
sub {
  top: 0.4em;
}
```

To be honest, I'm not completely happy with the grid system. I notice that if you have a header which is just a bit too big to fit in one row, it takes up two rows and has excessive whitespace above and below. 

Still, I like the elegance of the grid system and it's good enough for now. 

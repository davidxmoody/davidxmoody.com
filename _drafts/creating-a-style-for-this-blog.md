---
layout: post
title: Creating a style for this blog
---

I didn't want to use an existing template for this blog. As a web programmer/designer, it would feel wrong not to make my own. 

However, I'm not an artist. I've struggled with creating visually attractive content in the past. For my last project, [professorp.co.uk](http://professorp.co.uk/), I opted to use the default Bootstrap theme. I just wanted to get something up and running quickly.

This post will describe some of the things I've learned while creating this blog. 


## Great artists steal

I'm reasonably confident in my ability to implement any given design with CSS/HTML. However, as I've discovered, *implementing* a given design requires *having* a design first.

It's a trap I've fallen into far too often. I spend twenty minutes implementing some layout, getting all the elements to be perfectly centered or aligned. Then I step back to look at it and realise I don't like it at all. 

For this blog, I'm completely ripping off many design elements from another blog by [Tommy John Creenan](http://tommyjohncreenan.com/). I really liked the header design and simple colour scheme of his site. 

Like his header, mine features my own name in large capitals with a drop shadow and then a subtitle below. 

## Colours

I did want my own colour scheme though. Alas, choosing a colour scheme is no simple task either. I used the excellent website [paletton.com](http://www.paletton.com/) to choose [this colour scheme](http://www.paletton.com/#uid=1000u0kleqtbzEKgVuIpcmGtdhZ) from the presets. 

I copy-pasted the RGB codes into my Sass variables. This way, I can change my colour scheme very easily (as long as I don't want to go beyond a simple monochromatic scheme).

{% highlight scss %}
$color-base: #D34747;
$color-light: #F57373;
$color-lighter: #FFA3A3;
$color-dark: #B52626;
$color-darker: #8F0C0C;
{% endhighlight %}

## Sticky footer

I wanted a footer in a similar style to the header. A banner of colour with some simple text. That wasn't too tricky and I also decided to put a Creative Commons license in there too. 

I didn't like how it floated half way up shorter pages though. A footer half way up the page isn't really a footer after all. 

I used [this tutorial by Ryan Fait](http://ryanfait.com/html5-sticky-footer/) to achieve that. It makes the markup look a bit cluttered but it's good enough for now. 

I don't have many short pages anyway so I may investigate removing or changing this in the future. 

## Typography

Most of the stuff on this blog is going to be text so it's pretty important not to screw it up. 

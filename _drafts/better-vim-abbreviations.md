---
layout: post
title: Better Vim abbreviations
---

I've been using Vim, full-time, for nearly three years. I have written *a lot* of plain text in that time. 

Pretty early on, I noticed I was wasting a lot of time with several common typing patterns. For example, to type "I've" requires `<Shift>+i ' v e`. That's 5 key strokes including two stretches of the little fingers. I replaced that with the abbreviation `iab iv I've`. That's only two keys instead of five and it doesn't put any unnecessary stress on the little fingers (which I sometimes have problems with). 


Similarly, I use several other abbreviations for common typing patterns (mostly avoiding having to type apostrophes and capital letters). Here is a small sample:

{% highlight vim %}
iab i I
iab iv I've
iab il I'll
iab dont don't
iab didnt didn't

iab anki Anki
iab youtube YouTube

iab monday Monday
iab tuesday Tuesday
iab january January
iab february February

iab latek LaTeX
iab cof CoffeeScript
{% endhighlight %}

I keep these English-only abbreviations in a separate file which gets sourced when editing Markdown or text files. 

Some people also like to add common typos to their list of abbreviations. 



---
layout: post.html
title: Paragraph counts in jekyll
date: 2014-08-15
tags: featured
---

I'm a big fan of [Ars Technica](http://arstechnica.com/). There is one thing I particularly like about their RSS feed. It shows the first few paragraphs of the article followed by a link saying "Read X remaining paragraphs". 

If I can't read the full article from an RSS feed, this is the next best option. It has two big advantages: 

- It contains enough of the article to let you know if you will want to read the whole thing
- It lets you know how long the entire article will be

<!--more-->

I've seen many *bad* approaches to the same problem. Some feeds contain very limited information, frequently just the first paragraph of the article. I feel that the first paragraph alone is not usually enough to decide if the entire article is worth reading. 

## Emulating it in Jekyll

I wanted something like this for my blog. Both for the summary of all posts on the front page and also for the RSS feed. 

Jekyll already contains support for excerpts (accessible with `post.excerpt`). By default, the excerpt of a post will be the first paragraph. 

However, jekyll also supports setting a custom `excerpt_separator` variable in the `_config.yml` file. I changed mine to be two empty lines instead of the default of one. 

```
excerpt_separator: "\n\n"    # Default
excerpt_separator: "\n\n\n"  # My version
```

In each of my posts I then add an extra new line after the point I want the excerpt to end. You could choose anything for the excerpt separator but I like this because it is simple and doesn't mess with the Markdown processing. 

## Counting paragraphs

Now that we've defined a custom, multi-paragraph excerpt, we still need to count the number of *remaining* paragraphs in the post. 

Liquid templates weren't really designed for this kind of stuff and they lack full regular expression support. However, they do have the very convenient `split` filter which we will be using. We can split the formatted HTML of the post on the `'<p>'` substring. This will break it into segments for each paragraph. One slight caveat is that there will be an empty string before the first paragraph.

```html
{% assign total_paragraphs = post.content | split: '<p>' | size | minus: 1 %}
{% assign excerpt_paragraphs = post.excerpt | split: '<p>' | size | minus: 1 %}
{% assign remaining_paragraphs = total_paragraphs | minus: excerpt_paragraphs %}
<p><a href="{{ post.url }}">Read {{ remaining_paragraphs }} remaining paragraphs...</a></p>
```

## Short posts

What if you want to write a short post though? One where you want the excerpt to equal the entire post. Not a problem. If you simply don't include the `excerpt_separator` in your post then the excerpt will be equal to the full content of the post. 

You could also change the wording a bit:

```html
<p><a href="{{ post.url }}">
  {% if remaining_paragraphs > 0 %}
  Read {{ remaining_paragraphs }} remaining paragraphs...
  {% else %}
  View post on separate page
  {% endif %}
</a></p>
```

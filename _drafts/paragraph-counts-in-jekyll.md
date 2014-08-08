---
layout: post
title: Paragraph counts in jekyll
---

I'm a big fan of [Ars Technica](http://arstechnica.com/). One thing I like about their RSS feed is that it shows the first few paragraphs of the article followed by a link saying "Read X remaining paragraphs". 

I generally prefer to be able to read the entire article directly from the RSS feed but it's completely understandable for a site to not want to do that. 


Some *bad* approaches I've seen include:

- Nothing (beyond the title of the article)
- Really generic description (that tells you nothing the title doesn't)
- First paragraph only (acceptable but often isn't enough to decide if I want to read the whole thing)

I love the Ars Technica approach because it:

- Contains enough of the article to know if you are going to want to read it
- Lets you know how long the entire article will be

Despite this, I've never seen another site use this technique. 

## Emulating it in Jekyll

I wanted something like this for my blog. Both for the summary of all posts on the front page and also for the RSS feed. 

Jekyll already contains support for excerpts (accessible with `post.excerpt`). By default the excerpt of a post will be the first paragraph. 

However, jekyll also supports setting a custom `excerpt_separator` variable in the `_config.yml` file. I changed mine to be two empty lines instead of the default of one. 

{% highlight yaml %}
excerpt_separator: "\n\n"    # Default
excerpt_separator: "\n\n\n"  # My version
{% endhighlight %}

In each of my posts I then add an extra new line after the point I want the excerpt to end. You could choose anything for the excerpt separator but I like this because it is simple and doesn't mess with the Markdown processing. 

## Counting paragraphs

Now that we've defined a custom, multi-paragraph excerpt, we still need to count the number of *remaining* paragraphs in the post. 

Liquid templates weren't really designed for this kind of stuff and they lack full regular expression support. However, they do have the very convenient `split` filter which we will be using. We can split the formatted HTML of the post on the `'<p>'` substring to break it into segments for each paragraph. One slight caveat is that there will be an empty string before the first paragraph so we also have to subtract one from the total count. 

{% highlight html %}{% raw %}
{% assign total_paragraphs = post.content | split: '<p>' | size | minus: 1 %}
{% assign excerpt_paragraphs = post.excerpt | split: '<p>' | size | minus: 1 %}
{% assign remaining_paragraphs = total_paragraphs | minus: excerpt_paragraphs %}
<p><a href="{{ post.url }}">Read {{ remaining_paragraphs }} remaining paragraphs...</a></p>
{% endraw %}{% endhighlight %}

## Short posts

What if you want to write a short post though? One which is short enough that you want the excerpt to equal the entire post. Not a problem. If you simply don't include the `excerpt_separator` in your post then the excerpt will be equal to the entire post's content. 

You could also change the wording a bit:

{% highlight html %}{% raw %}
<p><a href="{{ post.url }}">
  {% if remaining_paragraphs > 0 %}
  Read {{ remaining_paragraphs }} remaining paragraphs...
  {% else %}
  View post on separate page
  {% endif %}
</a></p>
{% endraw %}{% endhighlight %}

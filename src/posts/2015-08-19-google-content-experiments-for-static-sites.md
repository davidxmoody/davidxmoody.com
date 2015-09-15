---
title: Google Content Experiments for static sites
date: 2015-08-19
tags: featured
draft: true
---

AB testing poses some unique problems on *static websites*. In this post, I will describe my particular implementation with [Google Analytics Content Experiments](https://developers.google.com/analytics/solutions/experiments) and what I learned along the way.

<!--more-->

## Why GA Content Experiments?

The biggest draw is **easy integration with Google Analytics**.

If you are not measuring *something* then there is no point to AB testing. By using Content Experiments, you can measure an experiment against metrics like pageviews, session time, custom events or any other goal you can set up in Google Analytics. GA is already so popular, there is a good chance you are already using it.

GA Content Experiments also directs more traffic to the most promising experimental variations. The aim is to try to *minimise lost conversions* over the course of the experiment by exploiting the information you have already gathered. As you will later see, I don't completely trust the way in which this is done and have explored some other possible methods (see my upcoming post on *Bayesian Bandits*).

## Implementation

There is already an [official guide on how to set up JavaScript experiments here](https://developers.google.com/analytics/solutions/experiments-client-side). For the *initial setup*, I recommend you just follow that. 

After the experiment has been created (and tied to a GA goal), you can proceed with the following steps to actually *implement* some experimental variations on a static site.

### Add header code

The Google's experiment script must fire on the page. Note that unlike in the guide, I recommend placing the script in the `head` of the document.

```html
<!-- Load the Content Experiment JavaScript API client for the experiment -->
<script src="//www.google-analytics.com/cx/api.js?experiment=YOUR_EXPERIMENT_ID"></script>
```

### Add a CSS rule to the page

Use the `cxApi.chooseVariation()` method to choose one of your experimental variations. Based on that result, conditionally write a CSS rule to the page using `document.write()`.

Here is a simple example. I wanted to test whether showing all posts on my homepage would perform better than showing only posts which I thought were worth showing off. I added a "featured" tag to every post I thought was good. Then in my build script, I added a class of `experiment-hide` to any post on the home page without that tag. 

The following script 

```html
<script>
// Ask Google Analytics which variation to show the user.
var chosenVariation = cxApi.chooseVariation();
switch (chosenVariation) {
  case 0:
    console.log('Choosing variation #0: Show all posts');
    // Do nothing
    break;
  case 1:
    console.log('Choosing variation #1: Show only featured posts');
    document.write('<style>.experiment-hide {display: none;}</style>');
    break;
}
</script>
```

Here is an example of what the HTML might look like.

```html
<article>This is visible</article>
<article class="experiment-hide">This *may* be hidden</article>
```

## Alternatives

What if you want to do something more complex than just hiding things? Well you can! Here is a quick list of ideas that would work with the method I have already outlined:

- Place a script as the first piece of content within the `body` tag. That script could then conditionally add a new class to the body when an experimental variation is chosen. The main stylesheet would then display the page differently based on the `body` having that class.

- In the original variation, write out a link to the *main stylesheet*. In the experimental variation, write out a link to an *alternate stylesheet*.

- Use `document.write()` in the body of the document to conditionally write out the *actual content* that you want to experiment with. You could also use `noscript` tags as fallbacks if appropriate.

## Asynchronous alternative

All of the above examples use some weird hacks in an attempt to eliminate any possible *page flicker*. However, if you don't mind it (or don't have a choice) then the script can be run asynchronously. You could use jQuery to wait until the document is ready and then choose a variation and change the page as necessary. 

This option has the advantage of not blocking the page from loading while the experiment script is fetched. It may also make deployment easier to manage (if you are using Google Tag Manager for example).

- Additional delay in loading any page with a request that can't be cached
- More code complexity
- Possible inconsistent user experience for the same user on different sessions
- Very hard to decide (for a blog) what to measure as a goal (session time/page views?, maybe comments?)

## Server side alternative

## The lazy alternative

## Bayesian bandits

## Conclusions

- My blog doesn't get enough traffic (show graph)
- Don't forget to mention YW site

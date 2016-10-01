---
layout: post.html
title: Google Content Experiments for static sites
date: 2015-09-17
tags: featured
---

AB testing poses some unique problems for *static websites*. In this post, I will describe my particular implementation with [Google Analytics Content Experiments](https://developers.google.com/analytics/solutions/experiments) and what I learned along the way.

<!--more-->

## Why GA Content Experiments?

The biggest draw is **easy integration with Google Analytics**.

If you are not measuring *something* then there is no point to AB testing. By using Content Experiments, you can measure an experiment against metrics like pageviews, session time, custom events or any other goal you can set up in Google Analytics. 

GA Content Experiments also directs more traffic to the most promising experimental variations. The aim is to try to *minimise lost conversions* over the course of the experiment by exploiting the information you have already gathered. However, I don't completely trust the way in which this is done and have explored some other possible methods (see my upcoming post on *Bayesian Bandits*).

## Implementation

There is already an [official guide on how to set up JavaScript experiments here](https://developers.google.com/analytics/solutions/experiments-client-side). For the *initial setup*, I recommend you just follow that. 

After the experiment has been created (and tied to a GA goal), you can proceed with the following steps to actually *implement* some experimental variations on a static site.

### Add the experiment script

The experiment script must fire on the page. Note that unlike in the guide, I recommend placing the script in the `head` of the document.

```html
<!-- Load the Content Experiment JavaScript API client for the experiment -->
<script src="//www.google-analytics.com/cx/api.js?experiment=YOUR_EXPERIMENT_ID"></script>
```

### Write a CSS rule to the page

Next, use the `cxApi.chooseVariation()` method to choose an experimental variation. Based on that result, conditionally write a CSS rule to the page using `document.write()`.

Here is a simple example. I wanted to test whether showing all posts on my homepage would perform better than showing only my favourite posts. I added a "featured" tag to every post I thought was good. Then in my build script, I added a class of `experiment-hide` to any post on the home page without that tag. The style rule `.experiment-hide {display: none;}` is then written to the `head` of the document if the experimental variation is chosen.

```js
switch (cxApi.chooseVariation()) {
  case 0:
    // Original variation, do nothing
    break;
  case 1:
    document.write('<style>.experiment-hide {display: none;}</style>');
    break;
}
```

Here is an example of roughly what the HTML could have looked like. 

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

It can result in faster initial page load times (0.85s vs 1.29s for my blog). If your experimental content is below the fold then I would always recommend this method.

## The lazy alternative

I know this isn't really an "alternative" but another valid option is to simply **not bother AB testing**. Instead you could just rely on your own *design skills*, run variations *sequentially* or *observe* real life users interacting with your site. 

## Conclusion

I have used this method multiple times on two static websites. The first was [YourWealth.co.uk](https://www.yourwealth.co.uk/) and the second was this blog. In both cases, the results were mildly underwhelming. 

For my blog in particular, I found that I just wasn't getting enough traffic to the experimental pages to gather meaningful information. I also *don't trust* the way in which Google calculate the "winning variation". In one of my experiments, the original received just 2 sessions (average session time of 0 minutes) and the variation received 35 sessions (average session time of 1 minute 24 seconds). Google proclaimed the variation to have a "100% chance of outperforming the original". Obviously complete bullshit. Most experiments aren't as bad as that though.

In summary, AB testing *can* be a very useful tool in the right situations and it *can* be done effectively on a static website. 

However, it is also *not* a tool to simply throw blindly at any problem. You have to weigh up the potential benefits against the development costs. If your goals could be better accomplished by spending your resources elsewhere (e.g. fixing known bugs) then you should do that instead.

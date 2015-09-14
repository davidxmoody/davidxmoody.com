---
title: Google Content Experiments for static sites
date: 2015-08-19
tags: featured
draft: true
---

AB testing poses some unique problems when used on a *static website*. In this post, I will describe my particular implementation with Google Analytics Content Experiments and what I learned along the way.

TODO add link to GACE

<!--more-->

## What does GA Content Experiments offer?

The biggest draw is **easy integration with Google Analytics**.

If you are not measuring *something* then there is no point to AB testing. By using Content Experiments, you can measure an experiment against metrics like pageviews, session time, custom events or any other goal you can set up in Google Analytics. Heck, GA is already so popular, there is a good chance you are already using it.

GA Content Experiments also directs more traffic to the most promising experimental variations. The aim is to try to *minimise lost conversions* over the course of the experiment by exploiting the information you have already gathered. As you will later see, I don't completely trust the way in which this is done and have explored some other possible methods (see my upcoming post on *Bayesian Bandits*).

## Implementation

- Link to guide

### 1. Set up experiment

- Brief summary of guide (no detail)

### 2. Add header code

The experiment script must fire on your page:

```html
<!-- Load the Content Experiment JavaScript API client for the experiment -->
<script src="//www.google-analytics.com/cx/api.js?experiment=YOUR_EXPERIMENT_ID"></script>
```

### 3. Add a CSS rule to the page

Use the `cxApi.chooseVariation()` method to choose one of your experimental variations. Based on that result, conditionally write a CSS rule to the page using `document.write()`.

In the following simple example, anything with a class of `experiment-hide` gets hidden if the first variation is chosen:

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

TODO consider moving alternatives section to end of the document and mentioning it here?

## Alternatives

What if you want to do something more complex than just hiding things? That's fine. You can write basically anything with `document.write()`. You could write some more complex style rules or a link to an external stylesheet. 

You could also use `document.write()` in the body to conditionally write the content itself rather than just changing the style. 

### Asynchronous alternative

My particular version blocks the entire page from loading while the GA Content Experiments script loads in the head of the document. This allows writing styles into the head. It also prevents the *page flicker* that would come if you were to load in the base variation and then change it. 

However, if you don't mind the flicker or if your experimental content is below the fold (or if you just don't have a choice) then it can be asynchronous. Just use the async script attribute or put the scripts at the bottom of the body tag. 

You cannot use `document.write()` in this case though. Instead I would recommend using jQuery to change the document.

## Results

- My blog doesn't get enough traffic (show graph)
- Don't forget to mention YW site

## Drawbacks

TODO maybe combine drawbacks with above alternatives section?

- Additional delay in loading any page with a request that can't be cached
- More code complexity
- Possible inconsistent user experience for the same user on different sessions
- Very hard to decide (for a blog) what to measure as a goal (session time/page views?, maybe comments?)

## Alternatives

- Server side
- Don't use experiments, use good design instead
- Use Bayesian Bandit approach! (future post)

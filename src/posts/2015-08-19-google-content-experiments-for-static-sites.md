---
title: Google Content Experiments for static sites
date: 2015-08-19
tags: featured
draft: true
---

Key points:

- What is AB testing and why
- What does Google Content Experiments offer?
- How does it work
- Implementation details:
    1. Set up experiment
    2. Add header code
    3. If a variation is chosen then write a CSS rule to the page (why document.write?)
    4. Make the rest of your markup depend on that CSS rule to conditionally show/hide
- Results are that my blog doesn't get enough traffic (show graph)
- Drawbacks are:
    - Additional delay in loading any page with a request that can't be cached
    - More code complexity
    - Possible inconsistent user experience for the same user on different sessions
    - Very hard to decide (for a blog) what to measure as a goal (session time/page views?, maybe comments?)
- Alternatives are:
    - Server side
    - Faster page load but with a flicker
    - Only experiment with content below the fold
    - Instead of using CSS rules, use document.write for the actual content instead
    - Don't use experiments, use good design instead
    - Use Bayesian Bandit approach! (future post)

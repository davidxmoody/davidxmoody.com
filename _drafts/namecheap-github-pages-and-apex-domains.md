---
layout: post
title: Namecheap, GitHub Pages and apex domains
---

When I was setting up this blog, I was excited to learn that [GitHub Pages runs on a fast Content Delivery Network](https://github.com/blog/1715-faster-more-awesome-github-pages). But there is a problem. It does not work with apex domains (i.e. [davidxmoody.com](http://davidxmoody.com/) instead of [www.davidxmoody.com](http://www.davidxmoody.com/)).


Well, it doesn't work with apex domains on [Namecheap](https://www.namecheap.com/) (which I had already registered with). But it does work on other services like [DNSimple](https://dnsimple.com/). This really annoyed me. 

As I saw it, there were three possibilities:

1. Use a "www" subdomain
2. Switch to DNSimple
3. Don't take advantage of GitHub's CDN

I really wanted to stick with [davidxmoody.com](http://davidxmoody.com/) instead of [www.davidxmoody.com](http://www.davidxmoody.com/). There are arguments [for](http://www.yes-www.org/) and [against](http://no-www.org/) using "www". For a simple blog, I feel that not using it is far superior. 

I could have switched to DNSimple (or one of the few other services which could do the same thing). That would be complicated though. I'm also very very happy with Namecheap in every other way.

It would also be more expensive because DNSimple requires a "membership" fee in addition to the cost for registering each domain name. I estimated that Namecheap would cost me £8 yearly whereas DNSimple would cost me £31 yearly. Also, if you want more than two domains, DNSimple requires $80 yearly for Silver membership instead of the $30 for Bronze. That pushes the price way up and given that Namecheap was already working well for me, I decided it wasn't worth it. 

In the end, I went for option number three. My blog does not currently use GitHub's CDN. It's still pretty quick so I don't really mind.

Besides, this idea of using `ALIAS` records to point an apex domain to another domain is still relatively new. DNSimple have had it for [about two and a half years](http://blog.dnsimple.com/2011/11/introducing-alias-record/) and CloudFlare only added [CNAME Flattening earlier this year](https://support.cloudflare.com/hc/en-us/articles/200169056-CNAME-Flattening-RFC-compliant-support-for-CNAME-at-the-root). I would be surprised if Namecheap doesn't add something similar in the next couple of years. I can wait for it. 

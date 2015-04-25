---
title: CloudFlare and hashed CSS
---

One of the main advantages of static sites is supposed to be faster load times. However, I noticed this blog was still taking longer than expected to load. 

I discovered [this post by David Ensinger](http://davidensinger.com/2014/04/transferring-the-dns-from-namecheap-to-cloudflare-for-github-pages/) in which he describes the same problem. I've learned a lot from his other posts and we appear to have pretty similar setups. The problem he describes is a time consuming 302 redirect caused by using GitHub Pages with a DNS `A` record. I suggest you look at his post for more details. 


## CloudFlare

Anyway, his solution was to use [CloudFlare](https://www.cloudflare.com/) and CNAME flattening. 

To be honest, I had looked into CloudFlare before and completely misunderstood what they actually did. I thought they were an alternative hosting service who just happened to store your files in a "CDN". 

Turns out that they are actually more like a *wrapper* around your existing website. They replace your DNS with their own. Some requests then get passed through to your original server while some are cached by CloudFlare. This both reduces traffic for your own server as well as possibly reducing latency. 

I was very pleasantly surprised with their service. Their "5 minute setup" claim wasn't far off. For the low price of *free*, I can't fault their service in any way whatsoever. 

Using them also has the convenient side effect of eliminating that annoying 302 redirect. Here is a screenshot from <http://www.webpagetest.org/> of this blog's performance before and after switching to CloudFlare's DNS:

![Before: 3.371s first view, 0.088s repeat view](/images/cloudflare-and-hashed-css/before.png)

![After: 0.289s first view, 0.089s repeat view](/images/cloudflare-and-hashed-css/after.png)

## CSS caching 

Another benefit of using CloudFlare is that it gives me more control over HTTP caching (using Page Rules).

Every time you visit a new page on this blog, it used to require **two round trips**. One for the HTML and one to check that the `/css/main.css` file had not changed. In practice, it wasn't too bad given that the server almost always sends a 304 Not Modified response back. However, I still wanted to eliminate the extra round trip. 

One common way to do this is to insert a hash of the contents of the CSS file into the filename. For example, `main.css` might become:

```
main-281a5c8d54ffb9364e6bfea48573c761.css
```

You also have to send that CSS file with a very large `max-age` HTTP Cache-Control response header so the browser knows that it will be valid forever. 

This is similar to the way that HTTP determines freshness. However, instead of sending a validator back to the server, the validator is embedded in the HTML which references the CSS file. 

## metalsmith-fingerprint

There is already a handy [Metalsmith plugin for this](https://github.com/christophercliff/metalsmith-fingerprint). Here's a sketch of how I use it:

```js
var fingerprint = require('metalsmith-fingerprint');
var ignore = require('metalsmith-ignore');

// ...

  // Insert the hash of the file into its filename
  .use(fingerprint({
    pattern: 'css/main.css'
  }))
  // Forget the original file
  .use(ignore([
        'css/main.css'
  ]))

// ...
```

Then in my `templates/default.html` file I have:

```html
  <link rel="stylesheet" href="/{{fingerprint.[css/main.css]}}">
```

I have also set up a simple CloudFlare Page Rule for `davidxmoody.com/css/*`. It simply sets the "Browser cache expire TTL" to 1 year. 

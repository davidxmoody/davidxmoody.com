---
layout: post
title: My password generation scheme
---

I've been using computers for a long time. Way back in the days of Windows 95 I had a tremendously insecure password. I think it was `1234`. I later upgraded to `123456` and then the (clearly far superior) `654321`. 

At one point I used my mothers maiden name and later my cat's name. When I ran across sites that required numbers in the password, I simply added a `1` to the end.


As I became more tech-savvy, I slowly started strengthening my passwords. For a long time I had a scheme which consisted of eight "random" seeming characters followed by two letters corresponding to the name of the website. While *technically* making every password different, it would not have fooled anyone who knew what they were doing. 

A few months ago, when several high-profile websites were hacked, I decided I needed something better. It took a while but I think I've finally stumbled across the perfect system. 

## Correct horse battery staple

There is plenty of good advice on creating strong passwords. My scheme is originally based on [this famous XKCD comic](http://xkcd.com/936/):

[![correct horse battery staple comic](http://imgs.xkcd.com/comics/password_strength.png)](http://xkcd.com/936/)

In other words, a short list of common words can be trivially easy for a human to remember yet essentially impossible for a computer to guess. 

## Double salting

I have two modifications to that. The first is to choose a sequence of 8 easy to type characters and add it to the start of every password. For example, `lkjpoiuu`, or something like that. 

Why? As an analogy, consider the practise of [password salts](http://en.wikipedia.org/wiki/Salt_(cryptography)). The basic idea is to add on a small amount of random data to each password before hashing it. The random data is then stored along side the hashed password. One of the advantages of this is that, in the event that the entire (hashed) password database gets stolen, cracking the entire list of passwords becomes more time consuming as you must re-calculate every guess with each different salt. See [the Wikipedia article](http://en.wikipedia.org/wiki/Salt_(cryptography)#Benefits) for a better explanation. 

Similarly, by adding on a constant "random" but easy to type sequence to all of your passwords, you make it much harder for someone with no particular knowledge of you to guess your password. Nobody will stumble across your password with a dictionary attack because your random string will not be in any dictionary. 

Of course, if someone was *specifically targeting you* and they also knew your "salt" then it would do little good. The purpose is to help protect against untargeted attacks though. 

## Numbers and caps

Additionally, many sites require passwords to contain at least one number and/or at least one capital letter. It can be really annoying to have to remember which passwords require this. 

To get around this, I use the convention of choosing a memorable phrase which contains either the word "to", "too" or "for". I replace that word with the corresponding number, `2` or `4`. I then **always capitalise the next letter**, without exception. 

By doing this, as long as you can remember the memorable phrase, you will never have to struggle to remember whether it contains number or capitals. 

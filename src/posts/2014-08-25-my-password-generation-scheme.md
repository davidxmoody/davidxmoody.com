---
title: My password generation scheme
date: 2014-08-25
---

I've been using computers for a long time. Way back in the days of Windows 95 I had a tremendously insecure password. I think it was `1234`. I later upgraded to `123456` and then the (clearly far superior) `654321`. 

At one point I used my mothers maiden name and later my cat's name. When I ran across sites that required numbers in the password, I simply added a `1` to the end.


As I became more tech-savvy, I slowly started strengthening my passwords. For a long time I had a scheme which consisted of eight "random" seeming characters, followed by two letters corresponding to the name of the website. While *technically* making every password different, it would not have fooled anyone who knew what they were doing. 

A few months ago, when several high-profile websites were hacked, I decided I needed something better. It took a while but I think I've finally stumbled across the perfect system. 

## Correct horse battery staple

There is plenty of good advice on creating strong passwords. My scheme is based on [this famous xkcd comic](http://xkcd.com/936/):

[![correct horse battery staple comic](http://imgs.xkcd.com/comics/password_strength.png)](http://xkcd.com/936/)

Thus, for each password I think of a short list of words or a short phrase. I then concatenate them together and remove all punctuation and whitespace to form the base of my password. 

I find that silly or weird passphrases are easier to remember. Sometimes, I also base the phrase on a memory of something that happened to me. Even better if that memory is related to the website the password is for. For example, my current eBay passphrase is loosely based on the memory of an interaction I had with someone who bought something from me. Nobody could possibly guess it but I will never forget it. 

You should also avoid including punctuation or variations on words that could be easily confused later on. For example "I am going to staple a battery to this horse" could easily become "**I'm** going to staple a battery to this horse" or "I am going to staple a battery to **a** horse".

## Double salting

I have two additions to that system. The first is to choose a sequence of 8 easy to type characters and add it to the start of every password. For example, `lkjpoiuu`, or something like that. 

Why? As an analogy, consider the practice of <a href="http://en.wikipedia.org/wiki/Salt_(cryptography)">password salts</a>. The basic idea is to add on a small amount of random data to each password before hashing it. The random data is then stored along side the hashed password. One of the advantages of this is that, in the event that the entire (hashed) password database gets stolen, cracking the entire list of passwords becomes more time consuming (as you must re-calculate every guess with each different salt). See <a href="http://en.wikipedia.org/wiki/Salt_(cryptography)#Benefits">the Wikipedia article</a> for a much better explanation. 

Similarly, by adding on a constant "random" sequence to every password, you make it much harder for someone with no particular knowledge of you to guess your password. Nobody will stumble across your password with a dictionary attack because your random string will not be in any dictionary. 

Of course, if someone was *specifically targeting you* and they also knew your "salt" then it would do little good. The purpose is to help protect against *untargeted* attacks. 

## Numbers and caps

Additionally, many sites require passwords to contain at least one number and/or at least one capital letter. It can be really annoying to have to remember which passwords require this. 

To get around this, I use the convention of choosing a memorable phrase which contains either the word "to", "too" or "for". I replace that word with the corresponding number, `2` or `4`. I then **always capitalise the next letter**, without exception. 

By doing this, as long as you can remember the memorable phrase, you will never have to struggle to remember whether it contains numbers or capitals. This also won't weaken your password (even if somebody knows you are doing it) because the strength of the password lies in the passphrase you chose. 

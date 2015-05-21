---
title: Word frequency analysis with command line tools
---

I have previously written about [writing speeds](/writing-speeds/). I think one of the best ways to improve is to utilise [abbreviations](/better-vim-abbreviations/) and other [tricks](/vim-auto-capitalisation/). 

I recently looked into a shorthand system called [EasyScript](http://www.easyscript.com/). The most important part I took from it is to develop a set of short abbreviations for the most common words. They give a set of suggested abbreviations but I wasn't happy with them. Instead, I wanted to analyse my own writing to find my most commonly used words and phrases. 


## A simple Python script

A little while ago, I wrote the following Python 3 script to do just that. It utilises the `Counter` object and `fileinput` module to simplify the collection process. It also strips out unnecessary punctuation and converts to lower-case. 

```python
from collections import Counter
import fileinput

word_tallies = Counter()

for line in fileinput.input():
    words = line.split()
    words = [word.lower().strip('.,!?[]()*{}-<>:;"\'') for word in words]
    word_tallies.update(words)

for word, count in word_tallies.most_common(200):
    print(count, word)
```

## Bash script

The above Python script works perfectly. However, I wanted to try implementing the same thing with Linux command line tools. Roughly working from [this blog post](http://www.generation5.org/content/2004/nlpUnix.asp), I devised the following script:

```bash
tr -sc "[A-Z][a-z][0-9]'" '[\012*]' < "$IN_FILE" | \
  tr '[A-Z]' '[a-z]' | \
  sort | uniq -c | sort -nr | \
  head -n200
```

The `tr` command is a little tricky. Normally the `tr` command would replace any characters in the first set with the corresponding character in the second set. However, the `-c` option specifies to use the *compliment* of the first set (i.e. any characters *not* appearing in the first set). Thus any non-word character is replaced with `'[\012]'` (a newline character). 

The `-s` option specifies to replace a sequence of one or more matches with *only a single occurrence* of the replacement character. This avoids empty lines in the output when multiple punctuation characters appear in the input. The result is a list of words separated by newlines and stripped of punctuation. 

The second call of `tr` replaces all upper-case letters with their lower-case counterparts. This avoids duplicates due to words sometimes being at the start of a sentence. 

It is then piped to `sort` and `uniq -c`. This counts the occurrences of each word. `uniq -c` is designed to print out a count as soon as it sees something different to the last line it saw. That means you need to first pipe to `sort` to avoid duplicate counts.

It is then piped to `sort -nr` which sorts in *descending numerical order*. Then finally to `head -n200` to prevent the output from getting too large. 

## Bigrams and trigrams

Bigrams and trigrams are just sequences of two or three words that occur together ([see n-gram](http://en.wikipedia.org/wiki/N-gram)). They can be just as interesting as single word frequencies. 

I'm only just getting into `awk` after reading [this pretty good introductory tutorial](http://ferd.ca/awk-in-20-minutes.html). In the following script, an additional step has been added to replace the stream of words with a stream of word pairs.

The first `awk` statement prints out the previous word and the current word on the same line (skipping the very first word). The second statement just sets the previous word for use on the next line. I'm sure it could be prettier but it works well. 

```bash
tr -sc "[A-Z][a-z][0-9]'" '[\012*]' < "$IN_FILE" | \
  tr '[A-Z]' '[a-z]' | \
  awk -- 'prev!="" { print prev,$0; } { prev=$0; }' | \
  sort | uniq -c | sort -nr | \
  head -n200
```

This next script prints out trigrams instead of bigrams using the same kind of method. This could also be done with a for loop for n-grams of any size.

```bash
tr -sc "[A-Z][a-z][0-9]'" '[\012*]' < "$IN_FILE" | \
  tr '[A-Z]' '[a-z]' | \
  awk -- 'first!=""&&second!="" { print first,second,$0; } { first=second; second=$0; }' | \
  sort | uniq -c | sort -nr | \
  head -n200
```

## Did I learn anything useful?

Here is the output when run on my diary:

```
  71219 i
  42731 to
  41792 the
  33638 and
  30602 a
  27413 it
  21500 of
  20162 that
  18174 my
  13745 for
  13059 was
  12664 in
  11078 think
  10189 with
  10149 have
   9553 just
   9416 on
   9182 also
   9157 i'm
   8967 is
   8535 be
   8226 but
```

Not many surprises given how common all of these words are. Still, there are significant time savings to be had. I have slowly been training myself to type with certain abbreviations over the past few months. For example `"t" -> "to"`, `"h" -> "the"` and `"d" -> "and"`. Similarly for most of the words in that list. 

There are a total of 5,854,003 characters in my diary. By calculating the number of keystrokes saved per abbreviation and multiplying by the number of times that word appears in my diary, I estimate that I could have saved 559,440 characters with my above abbreviations alone. 

That's **10%** of my total keystrokes. Combined with other abbreviations and typing tricks, I think I could save 20-30% of all keystrokes. 

Personally, I think a 20% saving is *easily* worth the time and effort it takes to learn. I expect to be typing for my entire adult life. If I type 300,000 words a year for the next 50 years (conservative estimate) then I could save myself 16,000,000 total keystrokes over my entire lifetime. That's equivalent to about 60,000 minutes saved or 1,000 hours.

## Bigram results

I'm actually mildly disappointed with the bigrams I extracted. They are mostly just combinations of the most frequently occurring words. It's interesting but not especially useful. Here's a sample:

```
   8726 i think
   5039 that i
   4517 i was
   3726 i don't
   3599 to do
   3493 want to
   3446 going to
   3391 it was
   3388 of the
   3364 in the
```

And trigrams:

```
   2305 i think i
   1483 i want to
   1474 i'm going to
   1279 a lot of
    882 i think it
    874 i don't know
    758 be able to
    724 for a walk
    709 i don't think
    682 i think the
```

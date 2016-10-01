---
layout: post.html
title: Quick notes on advanced ES2015 features
date: 2016-01-07
tags: JavaScript
---

*[Note: I found this blog post 5 months after I first wrote it. It is not finished to the standard that I originally planned but I decided I'd still rather publish it now than delete it.]*

I first started programming JavaScript with vanilla ES5. I disliked it right from the start having grown accustomed to the nice syntax of Python and ended up switching to CoffeeScript for quite a while. However, around June of last year, I got interested in ES6/ES2015 again.

These are some of my notes from reading [this book](https://leanpub.com/understandinges6/read/) on ES6 features. I deliberately didn't write about anything I already found trivial, deciding to only focus on things I didn't already know. I never got to the end of the book but still decided to publish it.

<!--more-->

## New methods

- String `includes()`, `startsWith()` and `endsWith()`, `repeat()`
- Using let or const in for loops creates a new copy of each variable instead of re-using the same one
- Nested destructuring `var { repeat, save, rules: { custom }} = options;`
- If not using let or const or var for destructuring then must use brackets `({ repeat, save, rules: { custom }} = options);`
- Mixed destructuring `var { repeat, save, colors: [ firstColor, secondColor ]} = options;`
- `Number.isFinite()` and `Number.isNaN()` (not the same as the globally scoped versions because they don't accept strings
- `Number.isSafeInteger()` to check if a number is within the range where integer rounding errors won't occur
- New Math methods: hypot, log2, log10, sign, trunc
- `Object.is()` for a better version of `===`

- Default arguments used when argument is not passed OR is passed as undefined (BUT NOT null)
- Default arguments are re-evaluated on each invocation (which is DIFFERENT to how Python does it)
- Default arguments for destructuring parameters `function setCookie(name, value, { secure, path, domain, expires } = {}) {`

- All functions have a "name" property

```js
function doSomething() {}
var doAnotherThing = function() {};
console.log(doSomething.name);      // "doSomething"
console.log(doAnotherThing.name);   // "doAnotherThing"
```

- function names account for lots of stuff like `console.log(doSomething.bind().name);   // "bound doSomething"` also they have "get" or "set" at the start if they are getters or setters

## Generators

From: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators>

- An *iterator* is a thing that has a next method and keeps track of its own position
- An *iterable* is something that can supply an iterator to iterate over its own values
- The iterable has a method on the property `Symbol.iterator` which generates a new iterator each time it is called (for example, it could be a generator function)
- Strings, Arrays, Maps and Sets are all iterable
- An iterator's `next()` method returns a `{value: "foo", done: false}` or `{value: undefined, done: true}`, "done" will come *after the last value*

Generators are just like Python generators.

- No code in the generator is run until the first time `next()` is called
- You can pass values in with `next(value)` (just like Python coroutines)
- The first value passed to `next()` is ignored because the generator is just starting out
- Subsequent values passed to `next()` are substituted to the value of `yield something`

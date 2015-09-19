---
title: My favourite lesser known ES2015 features
slug: my-favourite-lesser-known-es2015-features
date: 2015-09-19
tags: 
draft: true
---

Link: https://leanpub.com/understandinges6/read/#leanpub-auto-introduction

<!--more-->

- string `includes()`, `startsWith()` and `endsWith()`, `repeat()`
- using let or const in for loops creates a new copy of each variable instead of re-using the same one
- nested destructuring `var { repeat, save, rules: { custom }} = options;`
- if not using let or const or var for destructuring then must use brackets `({ repeat, save, rules: { custom }} = options);`
- mixed destructuring `var { repeat, save, colors: [ firstColor, secondColor ]} = options;`
- `Number.isFinite()` and `Number.isNaN()` (not the same as the globally scoped versions because they don't accept strings
- `Number.isSafeInteger()` to check if a number is within the range where integer rounding errors won't occur
- New Math methods: hypot, log2, log10, sign, trunc
- `Object.is()` for a better version of `===`

- default arguments used when argument is not passed OR is passed as undefined (BUT NOT null)
- default arguments are re-evaluated on each invocation (which is DIFFERENT to how Python does it)
- default arguments for destructuring parameters `function setCookie(name, value, { secure, path, domain, expires } = {}) {`

- all functions have a "name" property `function doSomething() {}
var doAnotherThing = function() {};
console.log(doSomething.name);          // "doSomething"
console.log(doAnotherThing.name);       // "doAnotherThing"`

- function names account for lots of stuff like `console.log(doSomething.bind().name);   // "bound doSomething"` also they have "get" or "set" at the start if they are getters or setters

Currently up to "new.target" section

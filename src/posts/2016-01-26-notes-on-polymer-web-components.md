---
title: Notes on Polymer Web Components
date: 2016-01-26
tags: polymer
---

These are some of my notes from reading through the [Polymer documentation](https://www.polymer-project.org/1.0/). I was using version 1.2.3 so things may have changed since then.

<!--more-->

## Basic structure

- The top level element should be `<dom-module id="my-element">` (the `id` must be the name of the element you are defining).

- Within the `<dom-module>` tag, there is a `<template>` tag which contains:
    - A `<style>` tag or `<link>` tag for locally scoped styles
    - Any markup for the element

- Within the `<dom-module>` tag, you also have a `<script>` tag which registers the element with the `Polymer()` function.

Example of what this looks like:

```html
<dom-module id="element-name">

  <template>
    <style>
      /* CSS rules for your element */
    </style>

    <!-- local DOM for your element -->

    <div>{{greeting}}</div> <!-- data bindings in local DOM -->
  </template>

  <script>
    // element registration
    Polymer({
      is: "element-name",

      // add properties and methods on the element's prototype

      properties: {
        // declare properties for the element's public API
        greeting: {
          type: String,
          value: "Hello!"
        }
      }
    });
  </script>

</dom-module>
```

## Registration

- **Custom element names must always contain a dash.**

- The `Polymer()` function returns a constructor for the element which can be called directly (although I don't feel that is particularly useful), alternatively you can use `document.createElement("my-element")`, or you can use a framework or embed them directly in the HTML of the page.

- You can supposedly "extend" native elements like `<input>` although I don't currently know how that works, I guess it just copies all the behaviour of the original element and adds extras. To actually use them, use the original tag with an `is` attribute: `<input is="my-input">`

## Callbacks

- `created`: for when an element has been created but nothing has been done with it yet
- `attached`: attached to the DOM
- `detached`: detached from the DOM
- `attributeChanged`: accepts the name of the attribute that was changed on the element, also accepts a "type" although I don't know what that does, use `this.getAttribute(name)` to get the new value of the attribute

The `ready` callback is unique to Polymer. It is called after the local DOM has been created but before it has been attached to the DOM. Order of callbacks:

`created -> children ready -> ready -> attached`

Use the `hostAttributes` property in the Polymer constructor to make an element have attributes when created in HTML. I do not know what the purpose of this is. Maybe you might want to set `tabindex` on something so that it doesn't get focus.

`Polymer.Class` can be used to create a Polymer element but not register it at the same time. Not sure why this would be useful.

## Properties

- Use the `properties` object in the Polymer constructor when you want to provide the ability for the user to pass down custom properties.

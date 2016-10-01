---
title: Notes on Polymer Web Components
date: 2016-01-26
tags: polymer
---

*[Note: I found this blog post 5 months after I first wrote it. I didn't get around to publishing it at the time but decided I'd rather publish it now than delete it.]*

These are some of my notes from reading through the [Polymer documentation](https://www.polymer-project.org/1.0/). I was using version 1.2.3 so things may have changed since then.

<!--more-->

## Basic structure

- The top level element should be `<dom-module id="my-element">` (the `id` must be the name of the element you are defining).

- Within the `<dom-module>` tag, there is a `<template>` tag which contains: A `<style>` tag or `<link>` tag for locally scoped styles and any markup for the element

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

- Each key of the `properties` object is an object with the key being the name, a `type` property (e.g. `String`), a `value` default value. 

- An optional `computed: "myFunction(param1, param2)"` property to define computed properties. Is only invoked once all dependant properties are not `undefined`.

- Various other options for notifying and data binding control (`reflectToAttribute`, `readOnly`, `notify`, `observer`).

- To map an *attribute name* (i.e. the thing in the HTML source) to a *property*, there are two ways to convert (these do not feel obvious and may trip me up in the future): **(1)** Attribute `firstname` or `firstName` goes to property `firstname` or **(2)** attribute `first-name` goes to property `firstName`

- Shorthand for simple properties which only have a `type` and nothing else: `properties: {foo: String, bar: Boolean}`

- Observers can be added to properties by giving their name as a string and get called with the new value and old value.

- You can also define an array of observers in the top level rather than one for each component. They can depend on multiple properties and nested properties. You can also use a wildcard to listen for multiple nested property changes (e.g. `observers: ['userNameChanged(user.name.*)']`).

- There is also a whole complex "splices" option for listening to changes in arrays.

## Local DOM

- Local DOM has multiple implementations. Shadow DOM can be used if it is supported, otherwise a custom implementation called "shady DOM" is used. Currently shady DOM is used on all browsers which would explain why I wasn't able to see a real shadow DOM being used in my tests.

- Nodes in the local DOM are stored by id in `this.$`.

- For finding dynamically created nodes use `this.$$(selector)`. It returns the *first* node that matches the selector.

- The element's children are its "light DOM". They can be placed into the template with the `<content>` tag.

- Optionally give the content node a select attribute to select on the light DOM content matching that (e.g. `<content select="h3"></content>`).

- There are a whole bunch of functions for accessing the DOM found on `Polymer.dom(parent)`.

- `this.root` is the root of the local DOM tree. Example: `var toLocal = document.createElement('div'); Polymer.dom(this.root).appendChild(toLocal);`

- There are methods for accessing "distributed children" and "effective children" when you select different parts of your content.

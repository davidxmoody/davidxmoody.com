---
title: Notes on Elm
slug: notes-on-elm
date: 2016-08-14
tags: Elm
---

I recently got interested in the Elm programming language. A little while ago I started reading the PureScript docs and then later started learning Haskell. However I'm generally much more focused on frontend development and could never really see myself using either of those languages for much.

Elm has most of the awesome functional programming features of Haskell. It also has a lot of similarities with Redux and can actually be used to create real-world applications. 

Here are some of my rough notes from reading through the [Elm docs](http://guide.elm-lang.org/). I also implemented most of the examples from the docs, with my own modifications, in [this repo](https://github.com/davidxmoody/elm-play).

<!--more-->

## Basic syntax

- Strings require double quotes
- String concatenation with double plus `++`
- Rounded integer division supported with double slash `//` (like in Python)
- True and False values need to be capitalised (like in Python)
- `if cond then value1 else value2` (like Python again)
- There is no concept of truthy/falsy values (unlike JavaScript)
- List functions: `List.isEmpty`, `List.length`, `List.reverse`, `List.sort`, `List.map`
- Tuples with brackets for returning multiple values
- Records like objects, define with equals symbols instead of colons `{ x = 3, y = 4 }`, access with dot notation `point.x`
- Special dot notation to create a function to access that property of a record (`.propName record` will be equal to `record.propName`)
- Can do destructuring on records `under70 {age} = age < 70`
- Can assoc/merge in new properties to an existing record with pipe notation `{ bill | name = "Nye" }`
- In Elm (as opposed to JavaScript) you cannot ask for a prop that does not exist and there is no null or undefined
- Elm's records support structural typing

## The Elm Architecture

Basically identical to Redux:

- Model: State
- View: React view
- Msg: Actions
- Update: Reducer

The view has type `Model -> Html Msg` which means that the generated HTML can output `Msg` values which *automatically* get fed into the update/model cycle for you (when initialising the app with `main = Html.beginnerProgram { model = model, view = view, update = update }`)

HTML is basically generated with constructors named after the elements followed by a list of props then a list of children.

## Project setup

```
npm i -g elm
elm package install
elm-reactor
# Then open up http://localhost:8000/ for a pretty neat UI
```

## Playing with the counter example

- It ran fine
- Easily added a button component
- Adding a class name to a component requires `div [ attribute "class" "my-class" ] []` with `attribute` from the `Html.Attributes` package

**Something I don't understand:** 

I wrote this function to abstract away the creation of a button style:

```elm
buttonStyle : Model -> Attribute
buttonStyle model = style [ ("color", if model == 0 then "red" else "black") ]
```

And elm-reactor kept complaining with the following:

```
-- TOO FEW ARGUMENTS ------------------------- Main.elm

Type Html.Attribute has too few arguments.

39| buttonStyle : Model -> Attribute
                           ^^^^^^^^^
Expecting 1, but got 0.
```

Removing the type works fine and loading it up in the repl tells me the type is the following:

```
<function> : number -> Html.Attribute a
```

I don't currently know what the `a` argument passed to the `Html.Attribute` type is doing...

Edit: After further experimentation, I think that `Html.Attribute` accepts one argument (to make it a generic type or whatever that's called in Elm). If that argument starts with a lower-case character then it is a generic type variable. However the actual type that it needs to match with in this case is the `Msg` type (because the attributes can potentially be handlers which return messages I guess).

## Form example

- Not sure what is going on constructing the model with three empty strings (`model = Model "" "" ""`), putting values in there seems to update the values of the model even though when the HTML renders for the first time, there are no values in the text boxes (not sure if bug or intended behaviour)
- **Edit:** Wait, I just realised that it's because the inputs are never actually being passed a value, they only have an `onInput` handler which won't actually control the initial value passed...
- Seems that the "type" HTML input attribute has to be called `type'` to avoid a naming clash
- Can use `let ... in ...` syntax for (multiple) temporary variables

## Effects

For producing effects, your model should return a tuple of the new model plus an effect command. Use `Cmd.none` for an empty command.

- Use `Random.generate` to create a command to generate a random action
- Must also tell it how to create a message: `Random.generate NewFace (Random.int 1 6)`

Just wrote out the basic dice program from scratch without looking at anything for reference. Seems relatively straightforward. Apparently `Sub` and `Cmd` appear to be always available and they both have a `.none` property to do nothing.

Difference between `type` and `type alias`:

- `type alias` is just an alias for something that already would have been a valid type before (e.g. a specific type of record)
- `type` constructs a new type that did not exist before, it defines a union of new type constructors (which accept any arguments) used to construct something of that type

Http fetching seems okay, if a tad verbose:

- `Task.perform FetchFail FetchSucceed (Http.get decodeGifUrl url)`
- Use `Task.perform` for something that might fail with two message constructors for each case
- Need to decode the server response JSON using the `Json.Decoder` stuff which I won't write about here
- WebSockets seem nice although I've never actually used them on the server before anyway

## Modularity

Modules expose stuff at the top of the file:

```elm
module Counter exposing (Model, Msg, init, update, view)
```

In the above example, external code cannot instantiate a value of type `Msg` because it only has access to the `Msg` type and not the type constructors that make it up.

- `App.map Top (Counter.view model.topCounter)`
- Compose views with `App.map` to make any messages passed from the `Html` get preceded by the `Top` constructor

## More notes on types

- Function definitions are just shorthand for assigning a lambda expression: `half n = n / 2` is treated identically to `half = \n -> n / 2` (the syntax is obviously much more useful when you have multiple arguments)
- You can have *type variables* `type List a = Empty | Node a (List a)`
- You can have triple quoted strings `decodeString user """{ "name": "Tom", "age": 42 }"""`

## How to use in the real world

- Generate full index.html file and let it set everything up for you
- Generate a JavaScript file which sets a global `Elm.MyModule` variable to have three methods: `fullscreen()` to take over the body tag, `embed(node)` to mount on a node and `worker()` to just run it with no UI
- Could theoretically use with React with the embed method style and React refs to get access to the DOM node to mount on

## Ports

- Initialise an app with `const app = Elm.AppName.fullscreen()`
- Subscribe to a port with `app.ports.check.subscribe(callback)`
- Send data back through a port with `app.ports.suggestions.send(data)`

Then create ports with the following syntax:

```elm
port check : String -> Cmd msg

port suggestions : (List String -> msg) -> Sub msg
```

The syntax is a bit weird but the basic idea is that you use the first port and provide it with a string value. This then returns a command and when that command is passed to Elm, it notifies the JavaScript subscriber on that port with that string value. 

The second type of port is given a function that can interpret whatever JavaScript gives it and returns a message. After being given a processing function, it returns a subscription which is passed to Elm and will process anything given on that port and return a message which gets dispatched to the update cycle.

Most JSON-like values can be transferred and there are various rules to prevent incorrect things getting in (if you try to pass something wrong from JavaScript it will throw an error before even reaching Elm).

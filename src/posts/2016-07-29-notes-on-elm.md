---
title: Notes on Elm
slug: notes-on-elm
date: 2016-07-29
tags: 
draft: true
---

Here are some of my notes from reading through the [Elm docs](http://guide.elm-lang.org/).

<!--more-->

## Basic syntax

- Strings require double quotes
- String concatenation with double plus `++`
- Rounded integer division supported with double slash `//` (like in Python)
- True and False values need to be capitalised
- `if cond then value1 else value2` (like Python again)
- There is no concept of truthy/falsy values like in JavaScript
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

Edit: After further experimentation, I think that `Html.Attribute` accepts one argument (to make it a generic type or whatever that's called in Elm). If that argument starts with a lower-case character then it is a generic type variable (e.g. how a filter function might map from any type of list to the same type of list given a function that accepts that type and returns a boolean). However the actual type that it needs to match with in this case is the `Msg` type (because the attributes can potentially be handlers which return messages I guess).

## Form example

- Not sure what is going on constructing the model with three empty strings (`model = Model "" "" ""`), putting values in there seems to update the values of the model even though when the html renders for the first time, there are no values in the text boxes (not sure if bug or intended behaviour)
- Seems that the "type" html input attribute has to be called `type'`
- Can use `let ... in ...` syntax for temporary variables
- I notice that in the examples, the value of input fields is not bound...

Just reached [here](http://guide.elm-lang.org/architecture/effects/random.html)...

## Effects

For producing effects, your model should return a tuple of the new model plus an effect command. Use `Cmd.none` for an empty command.

- Use `Random.generate` to create a command to generate a random action
- Must also tell it how to create a message: `Random.generate NewFace (Random.int 1 6)`

Just wrote out the basic dice program from scratch without looking at anything for reference. Seems relatively straightforward. Apparently `Sub` and `Cmd` appear to be always available and they both have a `.none` property to do nothing.

Difference between `type` and `type alias`:

- `type alias` is just an alias for something that already would have been a valid type before (e.g. a specific type of record)
- `type` constructs a new type that did not exist before, it defines a union of new type constructors (which accept any arguments) used to construct something of that type

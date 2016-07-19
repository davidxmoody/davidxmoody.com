---
title: Notes on Flow type checking in JavaScript
slug: notes-on-flow-type-checking-in-javascript
date: 2016-07-19
tags: 
draft: true
---

Here are some rough notes while setting up [Flow](https://flowtype.org/) and reading through all of the [official docs](https://flowtype.org/docs/getting-started.html).

<!--more-->

## Vim setup with Syntastic and eslint

This was very tricky to get working well. I wanted a solution which would still work with `eslint_d` and be fast (i.e. run as a background server). After a lot of struggle, I settled on the following configuration:

```
Plug 'scrooloose/syntastic'
let g:syntastic_javascript_checkers = ['eslint', 'flow']
let g:syntastic_javascript_eslint_exec = 'eslint_d'
let g:syntastic_javascript_flow_exe = 'flow'
let g:syntastic_aggregate_errors = 1
```

I also had to restart the `eslint_d` server in the directory with the `.eslintrc` config file.

## Notes on type checking syntax

- Primitive types: `["boolean", "number", "string", "null", "void"]`
- `any` type to opt out of type checking
- Arrays with either `number[]` or `Array<string>`
- Tuples for finite length arrays (because JavaScript doesn't have actual tuples) `const tuple: [string, number, boolean] = ["foo", 0, true]`
- One of many possible types with `string|number|boolean`
- Object: `const object: {foo: string, bar: number} = {foo: "foo", bar: 0}`
- Objects can also be used as lookup tables (i.e. variable keys) `const coolRating: {[id:string]: number} = {}`
- `Object` type like `any` but must be an object, accessing any key will return a value with the `any` type
- For a function that also has other properties, there is a special type: `{ (x: number): string; foo: number }`
- Functions: `function foo(a: number, b: number): number { return 4 }`
- Arrow functions: `(num: number): number => num * 2`
- Promise type: `Promise<string>`
- Async functions supported and have Promise return types
- `Function` type (similar to `Object` type) can be called with anything and return type `any`
- Defining a class also defines a type with the same name
- Classes are compatible if one extends the other
- Nominal typing means two types are compatible only if there is explicit inheritance, this is unlike structural/duck typing where compatibility is determined based on the shape of the data
- Interfaces are a way to describe similar classes without needing explicit inheritance `interface Fooable { foo(): string; }`
- `Class<SomeClass>` for the type of `SomeClass` (for if you need to assign a class to a variable or something)
- Can define type aliases for complex types reused in many places `type MyType = { foo: string, bar: number, baz: (foo: string) => boolean; }`
- Type aliases can accept another type to become generic types: `type GenericObject<T> = { foo: T };`
- Type parameters for classes specified after the class name and for functions after the function name in angled brackets
- Arrow functions accept type parameters before the first brackets: `const flip = <A,B>([a,b]: [A,B]): [B,A] => [b,a];`

## Built-in types

- Type casting by putting in brackets: `(myVar: string)`
- Implicit type casting by adding to a string is an exception that is allowed because it is so common in JavaScript: `((100 + "%") : string);`
- `(null: null)` and `(undefined: void)`
- Optional parameters and object properties with question mark: `function optFun(foo?: string) { (foo: string|void) }` and `type optType = { foo?: string }; ({foo: "bar"}: optType); ({}: optType)` (null is not allowed though!)
- Defaulted parameters are optional for callers but will always have a value in the function: `function default_fun(foo: string = "default foo") { (foo: string); }; default_fun();`
- Maybe types have confusingly similar syntax to optional parameters, they include null though: `function maybe_fun(foo: ?string) { (foo: string|void|null); }`
- Special `mixed` type is very similar to `any` except that in order to type cast, you need to perform the necessary `typeof x === "string"` style checks first
- Can have literal types: `("foo": "foo")` or `(true: true)` or `(1: 1)`
- Literal types do not work with expressions in most cases (because they could be too dynamic to calculate): `("fo"+"o": "foo") // Does not work`
- However, literal types do actually work with boolean expressions: `(!true: false); (true && false: false); (true || false: true);`
- Can build up enums `type Suit = | "Diamonds" | "Clubs" | "Hearts" | "Spades";`
- Weirdly, type definitions can start with a `|` after the equals sign, I think so that they can be split over multiple lines without looking awkward

## More notes

- Function types can also be defined elsewhere: `type TimesTwo = (value: number) => number;`
- Import and export types with `import type {Foo} from "./foo"` and `export type Foo = string`
- Exported classes must annotate everything (while in non-exported classes, it's okay to use more inference)
- Bounded polymorphism to keep type information but also constrain the allowed input types: ` function fooGood<T: { x: number }>(obj: T): T { console.log(Math.abs(obj.x)); return obj; }`
- Can have multiple type parameters: `class ReadWriteMap<K, V> { store: { [k:K]: V }; constructor() { this.store = {}; } get(k: K): ?V { return this.store[k]; } put(k: K, v: V): void { this.store[k] = v; } }`
- Some complex stuff about covariance and contravariance [link](https://flowtype.org/docs/classes.html#polymorphism-and-type-parameter-variance), covariance useful when one type parameter is read only (only appears as output), contravariance useful when one type parameter is only used as input, to use this put a plus before the type param `class ReadOnlyMap<K, +V> {}` (I think it's the same syntax for both of them)
- Special `this` type in classes, can only be used in output positions, might be used in a method that clones itself so that if it is extended then it will return the actual extended type (e.g. if D extends C and C had a method to clone itself then if the clone method had return type of `this` then calling the clone method on an instance of D will return an instance of D)
- Calling with too many arguments is allowed, a trick to prevent it: `function takesOnlyOneNumber(x: number, ...rest: Array<void>) {}; takesOnlyOneNumber(1, 2) // Error`
- Can overload in declarations: `declare function foo(...rest: Array<void>): string; declare function foo(a: number, ...rest: Array<void>): string; declare function foo(a: number, b: number, ...rest: Array<void>): string;` (but this is not supported outside the prelude and is generally not a great idea and you should generally use union types where possible)
- To check for not null or undefined, can use `myVar == null` because `undefined == null` but `undefined !== null`
- With destructuring, you can skip indices with a double comma: `var [a, b, ,c] = arr;`
- Intersection type requires something to be all of the input types: `({a: 1, b: ""}: {a: number} & {b: string})`
- Can assign a class to the evaluation of `typeof`, I don't see how this would be very useful, the example given uses static methods, `var b: typeof X = X;`
- For checking if something is an array, use `Array.isArray()`
- Can import and export types, can also `import typeof {jimiguitar as GuitarT} from "./User.js";`
- Exports should always have explicit type annotations (both for performance and good practice)
- Can use declarations to state that something has certain types, even if the thing does not exist yet (it will be provided globally at runtime or come from an external module for example) `declare var DEBUG: bool;`
- Mixins exist for declarations but they don't look like they would be a good idea to actually use
- Declared types can be made visible throughout the project with some special config
- Can declare modules to provide typing for modules with no type information found in them `declare module "fancy-pants" { declare var DEBUG: bool; }`
- Files with a `.js.flow` extension take precedence over type information in the original js file
- Should pretty much just work with React

# JStates

JStates - A simple js state library

[![NPM](https://nodei.co/npm/jstates.png)](https://npmjs.org/package/jstates)

![GitHub issues](https://img.shields.io/github/issues/orYoffe/jstates.svg)
![license](https://img.shields.io/github/license/orYoffe/jstates.svg)
![GitHub top language](https://img.shields.io/github/languages/top/orYoffe/jstates.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/jstates.svg)
![npm](https://img.shields.io/npm/v/jstates.svg)

## Why another state library

Many developers need a state to communicate between their services/components.
I wanted to introduce a very small [only 729B](https://bundlephobia.com/result?p=jstates),
simple state solution that would work for most cases.

In order to understand, compose or improve this library
you don't need more than to jump into the small source code and extend the functionality or create your own.

## Install

```sh
npm i -S jstates
```

# Usage

```js
const State = require("jstates");

const initialState = { counter: 0 };

// initiate with a name and an optional initiat state
// new State(name, initialState);
const myState = new State("myState", initialState);

console.log("myState.state: ", myState.state); // myState.state: {counter: 0}

// set a new state
myState.setState({ counter: ++myState.state.counter });
console.log("myState.state: ", myState.state); // myState.state: {counter: 1}

// set a new state with a function
myState
  .setState(state => ({ counter: ++state.counter }))
  .then(() => {
    console.log("myState.state: ", myState.state); // myState.state: {counter: 2}
  });
```

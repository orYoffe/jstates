<div align="center">
  <br><br><br><br><br>
  <img src="https://raw.githubusercontent.com/oryoffe/jstates/master/jstates.png" alt="jstates Logo" width="400">
  <br><br><br><br><br><br><br><br>
</div>

# JStates

JStates - A simple js state library

[JStates library for Reactjs](https://github.com/orYoffe/jstates-react)

[![NPM](https://nodei.co/npm/jstates.png)](https://npmjs.org/package/jstates)

![GitHub issues](https://img.shields.io/github/issues/orYoffe/jstates.svg)
![license](https://img.shields.io/github/license/orYoffe/jstates.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/jstates.svg)
![npm](https://img.shields.io/npm/v/jstates.svg)

## Why another state library

Many developers need a state to communicate between their services/components.
I wanted to introduce a very small,simple state solution that would work for most cases.

In order to understand, compose or improve this library,
you don't need more than to jump into the small source code and extend the functionality or create your own.

## Install

```sh
npm i -S jstates
```

## Usage

```js
const State = require("jstates");

const myState = new State({ counter: 0 });

function onUpdate() {
  console.log("onUpdate: counter changed to ", myState.state.counter);
}

myState.subscribe(onUpdate);

myState.setState({ counter: ++myState.state.counter });
// => onUpdate: counter changed to  1
```

## API

### State

```js
new State(<name>, <optional initial state>);
// => returns state Instance
```

### State instance

```js
const stateInstance = new State(<initial state>);

stateInstance.setState(<object or a function that returns and object >, <callback>);
// => returns a promise

stateInstance.subscribe(<function that will be called>);

```

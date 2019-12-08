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
I wanted to introduce a very small [only 729B and 402B gzip](https://bundlephobia.com/result?p=jstates),
simple state solution that would work for most cases.

In order to understand, compose or improve this library,
you don't need more than to jump into the small source code and extend the functionality or create your own.

## Install

```sh
npm i -S jstates
```

## Usage

```js
const State = require("jstates");

const initialState = { counter: 0 };

// initiate with a name and an optional initiat state
const myState = new State("myState", initialState);

console.log("myState.state: ", myState.state);
// => myState.state: {counter: 0}

// set a new state
myState.setState({ counter: ++myState.state.counter });
console.log("myState.state: ", myState.state);
// => myState.state: {counter: 1}

// set a new state with a function
myState
  .setState(state => ({ counter: ++state.counter }))
  .then(() => {
    console.log("myState.state: ", myState.state);
    // => myState.state: {counter: 2}
  });
```

### Subscribing for updates

```js
const State = require("jstates");

const initialState = { counter: 0 };
const myState = new State("myState", initialState);

function onUpdate() {
  console.log("onUpdate: counter changed to ", myState.state.counter);
}

myState.subscribe(onUpdate);

myState.setState({ counter: ++myState.state.counter });
// => onUpdate: counter changed to  1
```

### With multiple states

It is recommended in order to separate your updates,
to use multiple states to minimize the components that would be called on update

```js
const State = require("jstates");

const counterState = new State("counterState", { counter: 0 });
const userState = new State("userState", { username: "" });

function onCounterUpdate() {
  console.log("onCounterUpdate: counterState changed to ", counterState.state);
}

function onUserUpdate() {
  console.log("onUserUpdate: userState changed to ", userState.state);
}

function onUpdate(updatedKeys) {
  console.log("onUpdate: updatedKeys =", updatedKeys);

  if (updatedKeys.indexOf("counter") > -1) {
    console.log("onUpdate: counter changed to ", counterState.state.counter);
  } else if (updatedKeys.indexOf("username") > -1) {
    console.log("onUpdate: username changed to ", userState.state.username);
  }
}

counterState.subscribe(onCounterUpdate);
userState.subscribe(onUserUpdate);
counterState.subscribe(onUpdate);
userState.subscribe(onUpdate);

counterState.setState({ counter: ++counterState.state.counter });
// => onCounterUpdate: counterState changed to  {counter: 1}
// => onUpdate: updatedKeys = ["counter"]
// => onUpdate: counter changed to  1

userState.setState({ username: "John" });
// => onUserUpdate: userState changed to  {username: "John"}
// => onUpdate: updatedKeys = ["username"]
// => onUpdate: username changed to  John
```

## API

### State

```js
new State(<name>, <optional initial state>);
// => returns state Instance
```

### State instance

```js
const stateInstance = new State('myState', {});

stateInstance.setState(<function or an object>, <callback>);
// => returns a promise

stateInstance.subscribe(<function that will be called with the changed keys of the state>);

```

### State Middleware

```js
const stateInstance = new State("myState", {});

// hiding the original setState of the stateInstance
const setState = stateInstance.setState;

const lastModifiedMiddleWare = newState => {
  const time = new Date();
  console.log("State changed at ", time);
  setState({ ...newState, lastModified: time });
};

// overriding setState
stateInstance.setState = lastModifiedMiddleWare;

export default stateInstance;
```

### Debugging state

```js
const stateInstance = new State("myState", {});

stateInstance.subscribe(changedKeys => {
  console.log("changedKeys: ", changedKeys);
  console.log("stateInstance.state: ", stateInstance.state);
});
```

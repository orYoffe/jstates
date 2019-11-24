# JStates

JStates - A simple js state library

[![NPM](https://nodei.co/npm/jstates.png)](https://npmjs.org/package/jstates)

![GitHub issues](https://img.shields.io/github/issues/orYoffe/jstates.svg)
![license](https://img.shields.io/github/license/orYoffe/jstates.svg)
![GitHub top language](https://img.shields.io/github/languages/top/orYoffe/jstates.svg)
![npm bundle size (minified)](https://img.shields.io/bundlephobia/min/jstates.svg)
![npm](https://img.shields.io/npm/v/jstates.svg)

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

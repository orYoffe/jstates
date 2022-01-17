<div align="center">
  <br><br><br><br><br>
  <img src="https://raw.githubusercontent.com/oryoffe/jstates/master/jstates.png" alt="jstates Logo" width="400">
  <br><br><br><br><br><br><br><br>
</div>

# JStates

A super small, simple and fast ⚡ JavaScript state library

Also checkout [JStates library for Reactjs](https://github.com/orYoffe/jstates-react)

[![NPM](https://nodei.co/npm/jstates.png)](https://npmjs.org/package/jstates)

![GitHub issues](https://img.shields.io/github/issues/orYoffe/jstates.svg)
![license](https://img.shields.io/github/license/orYoffe/jstates.svg)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/jstates)
![npm](https://img.shields.io/npm/v/jstates.svg)

## Why another state library

Many developers need a state to communicate between their services/components.
I wanted to introduce a very small, simple state solution that would work for most cases.

In order to understand, compose or improve this library,
you don't need more than to jump into the small source code and extend the functionality or create your own.

## Install

```sh
npm i -S jstates
```

## Usage

```js
import { createState } from "jstates";
// types exported: import { JState, JStateSubscribers, JstateInstance } from "jstates";

const myState = createState({ counter: 0 });

function onUpdate(state) {
  console.log("onUpdate: counter changed to ", state.counter);
}

myState.subscribe(onUpdate);

// Updating with an object
myState.setState({ counter: ++myState.state.counter });
// => onUpdate: counter changed to  1

// Updating with a function
myState.setState((state) => ({ counter: ++state.counter }));
// => onUpdate: counter changed to  2
```

## API

```js
const initialState = {};
const stateInstance = createState(initialState);
/* => returns state Instance
{
  state,
  subscribers,
  setState,
  subscribe,
  unsubscribe,
};
*/

// Get the state
stateInstance.state;

// Change the state
stateInstance.setState(<object or a function that returns and object>);
// => returns a promise

// Subscribe to state changes
stateInstance.subscribe(<function that will be called with the state on each update>);


// Unsubscribe from state changes
stateInstance.unsubscribe(<function that already subscribed>);

```
 

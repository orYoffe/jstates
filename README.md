[![SWUbanner](https://raw.githubusercontent.com/vshymanskyy/StandWithUkraine/main/banner2-direct.svg)](https://github.com/vshymanskyy/StandWithUkraine/blob/main/docs/README.md)

<div align="center">
  <br><br><br><br><br>
  <img src="https://raw.githubusercontent.com/oryoffe/jstates/master/jstates.png" alt="jstates Logo" width="400">
  <br><br><br><br><br><br><br><br>
</div>

# JStates

A super small, simple and fast ⚡ JavaScript state library
A simple Observer (publisher - subscriber) pattern implementaion

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

### Counter

```js
import { createState } from "jstates";
// types exported: import { JStateGetState, SubFunction, JstateInstance } from "jstates";

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

### Todos (TS)

```ts
import { createState } from "jstates";
const todosState = createState<TodoState>({
  todos: [],
});

function onUpdate(state: typeof todosState.state) {
  console.log("onUpdate: todos changed to ", state.todos);
}

todosState.subscribe(onUpdate);

function removeTodo(todo: string) {
  todosState.setState((s: typeof todosState.state) => ({
    todos: s.todos.filter((t: string) => t !== todo),
  }));
}

const addTodo = (todo: string) => {
  todosState.setState((s: typeof todosState.state) => ({
    todos: s.todos.concat(todo),
  }));
};

addTodo("Buy milk");
addTodo("Buy eggs");
```

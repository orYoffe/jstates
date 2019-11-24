class State {
  constructor(name, initialState) {
    if (typeof name !== "string" || name.length < 1) {
      throw new Error(
        "State was not given a name. new State(name, initialState)"
      );
    }

    this.name = name;
    this.state = initialState;
    this.subscribers = [];
    this.setState = this.setState.bind(this);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter(f => f !== fn);
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  setState(updater, callback) {
    return Promise.resolve().then(() => {
      let nextState;

      if (typeof updater === "function") {
        nextState = updater({ ...this.state });
      } else {
        nextState = updater;
      }

      const keysChanged = Object.keys(nextState);
      this.state = Object.assign({}, this.state, nextState);

      return Promise.all(this.subscribers.map(sub => sub(keysChanged))).then(
        () => {
          if (callback) {
            return callback(this.state);
          }
        }
      );
    });
  }
}

module.exports = State;

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

  setState(createState, callback) {
    return Promise.resolve().then(() => {
      let newState;

      if (typeof createState === "function") {
        newState = createState({ ...this.state });
      } else {
        newState = createState;
      }

      if (newState == null) {
        if (callback) callback();
        return;
      }

      const keysChanged = Object.keys(newState);
      this.state = Object.assign({}, this.state, newState);

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

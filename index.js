class State {
  constructor(initialState) {
    this.state = initialState;
    this.subscribers = [];
    this.setState = this.setState.bind(this);
  }

  unsubscribe(fn) {
    this.subscribers = this.subscribers.filter((f) => f !== fn);
  }

  subscribe(fn) {
    this.subscribers.push(fn);
  }

  setState(createState = null, callback) {
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

      this.state = Object.assign({}, this.state, newState);

      return Promise.all(this.subscribers.map((sub) => sub(this.state))).then(
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

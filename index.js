function createState(initialState) {
  let state = initialState;
  let subscribers = [];

  function getState() {
    return state;
  }

  function unsubscribe(fn) {
    subscribers = subscribers.filter(function (f) {
      return f !== fn;
    });
  }

  function subscribe(fn) {
    subscribers.push(fn);
  }

  function setState(createState = null, callback) {
    let newState;

    if (typeof createState === "function") {
      newState = createState(state);
    } else {
      newState = createState;
    }

    state = Object.assign({}, state, newState);
    return Promise.all(
      subscribers.map(function (sub) {
        return sub(state);
      })
    ).then(function () {
      if (callback) {
        return callback(state);
      }
    });
  }

  return {
    getState: getState,
    unsubscribe: unsubscribe,
    subscribe: subscribe,
    setState: setState,
  };
}

module.exports = createState;

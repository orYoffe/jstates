const createState = require("../index");

describe("State", () => {
  it("should initialize initialState, state and subscribers", () => {
    const initialState = { fake: "value" };
    const state = createState(initialState);

    expect(state.state).toEqual(initialState);
  });

  it("should change state and call subscribed functions when state changes and not when unsubscribed", () => {
    const initialState = { fake: "value" };
    const state = createState(initialState);
    const subscriber = jest.fn();
    state.subscribe(subscriber);
    const newState = { fake: "value", some: "new value" };

    return state.setState(newState).then(() => {
      expect(state.state).toEqual(newState);
      expect(subscriber).toHaveBeenCalledTimes(1);

      const secondState = { newProp: "123" };
      state.unsubscribe(subscriber);
      return state.setState(secondState).then(() => {
        expect(state.state).toEqual({ ...newState, ...secondState });
        expect(subscriber).toHaveBeenCalledTimes(1);
      });
    });
  });

  it("integration", () => {
    const counterState = createState({ counter: 0 });
    const userState = createState({ username: "" });

    let counterUpdateCount = 0;
    function onCounterUpdate() {
      ++counterUpdateCount;
    }

    let userUpdateCount = 0;
    function onUserUpdate() {
      ++userUpdateCount;
    }

    let anyUpdateCount = 0;
    function onUpdate() {
      ++anyUpdateCount;
    }

    counterState.subscribe(onCounterUpdate);
    userState.subscribe(onUserUpdate);
    counterState.subscribe(onUpdate);
    userState.subscribe(onUpdate);

    expect(anyUpdateCount).toEqual(0);
    expect(counterUpdateCount).toEqual(0);
    expect(userUpdateCount).toEqual(0);

    return counterState
      .setState((state) => ({
        counter: ++state.counter,
      }))
      .then(() => {
        expect(anyUpdateCount).toEqual(1);
        expect(counterUpdateCount).toEqual(1);
        expect(userUpdateCount).toEqual(0);

        return userState.setState({ username: "John" }).then(() => {
          expect(anyUpdateCount).toEqual(2);
          expect(counterUpdateCount).toEqual(1);
          expect(userUpdateCount).toEqual(1);
        });
      });
  });

  describe("performance", () => {
    const createStatesAndSubscribers = (howMany) => {
      // create states
      const states = new Array(howMany).fill(null).map((d, i) => {
        const initialState = {};
        for (let index = 0; index < howMany; index++) {
          initialState[`prop${index}`] = Math.random();
        }
        return createState(initialState);
      });
      // create subscribers
      const subscribers = new Array(howMany).fill(null).map(() => jest.fn());

      // subscribe each subscriber to all states
      subscribers.forEach((subscriber) =>
        states.forEach((state) => state.subscribe(subscriber))
      );
      return { states, subscribers };
    };

    const generateRandomNewState = (howMany) => {
      const newState = {};
      for (let index = 0; index < howMany; index++) {
        newState[`newProp${index}`] = Math.random();
      }
      return newState;
    };

    it("states times subscribers plus setState for each state", () => {
      const newState = generateRandomNewState(howMany);
      const t0 = performance.now();
      const howMany = 500; // don't go over 1500, it starts being slow
      const { states, subscribers } = createStatesAndSubscribers(howMany);

      // call each setState on each state
      return Promise.all(states.map((state) => state.setState(newState))).then(
        () => {
          const t1 = performance.now();
          expect(parseInt(t1 - t0, 10)).toBeLessThan(howMany + 50);
          console.log(
            "\x1b[36m",
            "*** Creating ",
            "\x1b[32m",
            howMany,
            "\x1b[36m",
            " states with each having",
            "\x1b[32m",
            howMany,
            "\x1b[36m",
            " subscribers and calling setState on each and having them update took ",
            "\x1b[35m",
            parseInt(t1 - t0, 10),
            "\x1b[36m",
            "milliseconds."
          );

          subscribers.forEach((subscriber) =>
            expect(subscriber).toHaveBeenCalledTimes(howMany)
          );
        }
      );
    });

    it("states times subscribers times setState for each state", () => {
      const newState = generateRandomNewState(howMany);
      const newState2 = generateRandomNewState(howMany);
      const newState3 = generateRandomNewState(howMany);
      const t0 = performance.now();
      const howMany = 100; // don't go over 100, it starts being slow
      const { states, subscribers } = createStatesAndSubscribers(howMany);

      // call setState howMany times on each state
      let promises = [];
      states.forEach(() => {
        promises = promises.concat(
          states.map((state) => state.setState(newState))
        );
      });
      states.forEach(() => {
        promises = promises.concat(
          states.map((state) => state.setState(() => newState2))
        );
      });
      return Promise.all(promises).then(() => {
        let promises = [];
        subscribers.forEach((subscriber) =>
          states.forEach((state) => state.unsubscribe(subscriber))
        );
        states.forEach(() => {
          promises = promises.concat(
            states.map((state) => state.setState(newState3))
          );
        });
        return Promise.all(promises).then(() => {
          const t1 = performance.now();
          expect(parseInt(t1 - t0, 10)).toBeLessThan(howMany * 40 + 150);

          console.log(
            "\x1b[36m",
            "*** Creating ",
            "\x1b[32m",
            howMany,
            "\x1b[36m",
            " states with each having",
            "\x1b[32m",
            howMany,
            "\x1b[36m",
            " subscribers and calling setState",
            "\x1b[35m",
            howMany * 2 + " times",
            "\x1b[36m",
            "on each, unsubscribing and having them update took ",
            "\x1b[35m",
            parseInt(t1 - t0, 10),
            "\x1b[36m",
            "milliseconds."
          );

          subscribers.forEach((subscriber) =>
            expect(subscriber).toHaveBeenCalledTimes(howMany ** 2 * 2)
          );
        });
      });
    });
  });
});

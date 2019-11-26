const State = require("../index");

describe("State", () => {
  it("should throw an error when created without name", () => {
    expect(() => new State()).toThrow(
      "State was not given a name. new State(name, initialState)"
    );
  });

  it("should initialize with name, state and subscribers", () => {
    const name = "newState";
    const initialState = { fake: "value" };
    const state = new State(name, initialState);

    expect(state.name).toEqual(name);
    expect(state.state).toEqual(initialState);
  });

  it("should change state and call subscribed functions with the changed keys when state changes", () => {
    const name = "newState";
    const initialState = { fake: "value" };
    const state = new State(name, initialState);
    const subscriber = jest.fn();
    state.subscribe(subscriber);
    const newState = { fake: "value", some: "new value" };

    return state.setState(newState).then(() => {
      expect(state.state).toEqual(newState);
      expect(subscriber).toHaveBeenCalledWith(Object.keys(newState));
    });
  });

  it("integration", () => {
    const counterState = new State("counterState", { counter: 0 });
    const userState = new State("userState", { username: "" });

    let counterUpdateCount = 0;
    function onCounterUpdate() {
      ++counterUpdateCount;
    }

    let userUpdateCount = 0;
    function onUserUpdate() {
      ++userUpdateCount;
    }

    let anyUpdateCounterCount = 0;
    let anyUpdateUserCount = 0;
    let anyUpdateCount = 0;
    function onUpdate(updatedKeys) {
      ++anyUpdateCount;

      if (updatedKeys.indexOf("counter") > -1) {
        ++anyUpdateCounterCount;
      } else if (updatedKeys.indexOf("username") > -1) {
        ++anyUpdateUserCount;
      }
    }

    counterState.subscribe(onCounterUpdate);
    userState.subscribe(onUserUpdate);
    counterState.subscribe(onUpdate);
    userState.subscribe(onUpdate);

    expect(anyUpdateCount).toEqual(0);
    expect(anyUpdateCounterCount).toEqual(0);
    expect(anyUpdateUserCount).toEqual(0);
    expect(counterUpdateCount).toEqual(0);
    expect(userUpdateCount).toEqual(0);

    return counterState
      .setState({ counter: ++counterState.state.counter })
      .then(() => {
        expect(anyUpdateCount).toEqual(1);
        expect(anyUpdateCounterCount).toEqual(1);
        expect(anyUpdateUserCount).toEqual(0);
        expect(counterUpdateCount).toEqual(1);
        expect(userUpdateCount).toEqual(0);

        return userState.setState({ username: "John" }).then(() => {
          expect(anyUpdateCount).toEqual(2);
          expect(anyUpdateCounterCount).toEqual(1);
          expect(anyUpdateUserCount).toEqual(1);
          expect(counterUpdateCount).toEqual(1);
          expect(userUpdateCount).toEqual(1);
        });
      });
  });
});

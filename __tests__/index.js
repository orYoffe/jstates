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
});

import { vi } from "vitest";
import { createState } from "./index";

describe("State", () => {
  it("should initialize initialState, state and subscribers", () => {
    const initialState = { fake: "value" };
    const state = createState(initialState);

    expect(state.state).toEqual(initialState);
  });

  it("should throw error when given wrong initial state", () => {
    const errMessage = "Initial state is required to be an object or an array";
    expect(() => createState(null)).toThrowError(errMessage);
    expect(() => createState(function () {})).toThrowError(errMessage);
    expect(() => createState(false)).toThrowError(errMessage);
  });

  it("should change state and call subscribed functions when state changes and not when unsubscribed", () => {
    const initialState = { fake: "value" };
    const state = createState(initialState);
    const subscriber = vi.fn();
    state.subscribe(subscriber);
    const newState: Record<string, unknown> = {
      fake: "value",
      some: "new value",
    };

    return state.setState(newState).then(() => {
      expect(state.state).toEqual(newState);
      expect(subscriber).toHaveBeenCalledTimes(1);

      const secondState: Record<string, unknown> = { newProp: "123" };
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
});

export type JState = Object | null | undefined;
export type JStateSubscribers = JStateSubscriber[];
export type JStateSubscriber = (newState: JState, oldState: JState) => any | void;

export function createState(initialState: JState) {
  const subscribers: JStateSubscribers = [];
  return {
    state: initialState,
    subscribers,
    setState(getState: Function | JState): Promise<JState[]> {
      let oldState = JSON.parse(JSON.stringify(this.state));
      this.state = Object.assign(
        {},
        this.state,
        typeof getState === "function" ? getState(this.state, oldState) : getState
      );
      return Promise.all(
        this.subscribers.map((sub: JStateSubscriber) => sub(this.state, oldState))
      );
    },
    subscribe(fn: JStateSubscriber): void {
      this.subscribers.push(fn);
    },
    unsubscribe(fn: JStateSubscriber): void {
      this.subscribers = this.subscribers.filter(function (f) {
        return f !== fn;
      });
    },
  };
}

export type JstateInstance = ReturnType<typeof createState>;

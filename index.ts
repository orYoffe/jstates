export type JState = Object | null | undefined;
export type JStateSubscribers = Function[];

export function createState(initialState: JState) {
  const subscribers: JStateSubscribers = [];
  return {
    state: initialState,
    subscribers,
    setState(getState: Function | JState): Promise<JState[]> {
      this.state = Object.assign(
        {},
        this.state,
        typeof getState === "function" ? getState(this.state) : getState
      );
      return Promise.all(
        this.subscribers.map((sub: Function) => sub(this.state))
      );
    },
    subscribe(fn: Function): void {
      this.subscribers.push(fn);
    },
    unsubscribe(fn: Function): void {
      this.subscribers = this.subscribers.filter(function (f) {
        return f !== fn;
      });
    },
  };
}

export type JstateInstance = ReturnType<typeof createState>;

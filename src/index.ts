export type JStateGetState<T> = (state: T) => T
export type SubFunction<T> = (state: T) => void
export type JstateInstance<T> = {
	state: T
	subscribers: SubFunction<T>[]
	setState(getStateOrNewState: JStateGetState<T> | Partial<T>): Promise<void>
	subscribe(fn: SubFunction<T>): void
	unsubscribe(fn: SubFunction<T>): void
}

export function createState<T>(initialState: T): JstateInstance<T> {
	if (typeof initialState !== "object" || initialState === null) {
		throw new Error("Initial state is required to be an object or an array")
	}

	return {
		state: initialState,
		subscribers: [],
		async setState(getStateOrNewState) {
			let newState: Partial<T>
			if (typeof getStateOrNewState === "function") {
				newState = (getStateOrNewState as JStateGetState<T>)(this.state)
			} else {
				newState = getStateOrNewState
			}

			this.state = Object.assign({}, this.state, newState)

			await Promise.all(this.subscribers.map((sub: SubFunction<T>) => sub(this.state)))
		},
		subscribe(fn) {
			this.subscribers.push(fn)
		},
		unsubscribe(fn) {
			this.subscribers = this.subscribers.filter((f) => f !== fn)
		},
	}
}

import { vi } from "vitest";
import { createState, JstateInstance } from "jstates";
import exp from "constants";

interface TodoState {
  todos: string[];
}
describe("State ToDo app", () => {
  it("should initialise and update properly", () => {
    const todosState = createState<TodoState>({
      todos: [],
    });
    const subscriber = vi.fn();
    todosState.subscribe(subscriber);

    function removeTodo(todo: string) {
      todosState.setState((s: typeof todosState.state) => ({
        todos: s.todos.filter((t: string) => t !== todo),
      }));
    }

    const addTodo = (todo: string) => {
      todosState.setState((s: typeof todosState.state) => ({
        todos: s.todos.concat(todo),
      }));
    };

    // initial state
    expect(todosState.state.todos).toEqual([]);
    expect(todosState.subscribers).toEqual([subscriber]);

    // add todo
    addTodo("Buy milk");
    expect(todosState.state.todos).toEqual(["Buy milk"]);
    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenLastCalledWith({ todos: ["Buy milk"] });

    // add another todo
    addTodo("Buy eggs");
    expect(todosState.state.todos).toEqual(["Buy milk", "Buy eggs"]);
    expect(subscriber).toHaveBeenCalledTimes(2);
    expect(subscriber).toHaveBeenLastCalledWith({
      todos: ["Buy milk", "Buy eggs"],
    });

    // remove todo
    removeTodo("Buy milk");
    expect(todosState.state.todos).toEqual(["Buy eggs"]);
    expect(subscriber).toHaveBeenCalledTimes(3);
    expect(subscriber).toHaveBeenLastCalledWith({ todos: ["Buy eggs"] });
    removeTodo("Buy eggs");
    expect(todosState.state.todos).toEqual([]);
    expect(subscriber).toHaveBeenCalledTimes(4);
    expect(subscriber).toHaveBeenLastCalledWith({ todos: [] });

    // unsubscribe
    todosState.unsubscribe(subscriber);
    expect(todosState.subscribers).toEqual([]);
    expect(subscriber).toHaveBeenCalledTimes(4);

    // validate not receiving updates
    addTodo("Buy milk");
    expect(todosState.state.todos).toEqual(["Buy milk"]);
    expect(subscriber).toHaveBeenCalledTimes(4);
    expect(subscriber).not.toHaveBeenLastCalledWith({ todos: ["Buy milk"] });
  });
});

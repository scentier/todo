import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const TodoSchema = z.object({
  id: z.number().default(0),
  task: z
    .string()
    .min(3, { message: "What you do must be at least 3 characters." })
    .max(100, { message: "What you do must be less than 50 characters" }),
  status: z.boolean().default(true),
});

type TTodoSchema = z.infer<typeof TodoSchema>;

const App = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TTodoSchema>({ resolver: zodResolver(TodoSchema) });

  // https://stackoverflow.com/a/71550656
  // set the state to array, but it doesn't now what inside that array, so it treat the sate as never[]
  const [todos, setTodos] = useState<TTodoSchema[]>([]);

  // add new todo/task
  const addTodo = (data: TTodoSchema) => {
    setTodos([
      ...todos,
      {
        id: todos.length < 1 ? 1 : todos.length + 1,
        task: data.task,
        status: data.status,
      },
    ]);
    reset();
  };

  // 2 ways to update todo and mark it as done
  // 1. use updateTodo()
  const updateTodo = (todo: TTodoSchema) => {
    const upStatus = { ...todo, status: (todo.status = !todo.status) };
    setTodos(todos.map((td) => (td.id === todo.id ? upStatus : td)));
  };

  // 2. use index from todos.map(todo, index)
  const checkedTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].status = !todos[index].status;
    setTodos(newTodos);
  };

  // 2 way to delete methods
  // 1. use filter
  const deleteTodo = (todo: TTodoSchema) => {
    setTodos(todos.filter((t) => t.id !== todo.id));
  };

  // 2. use splice
  const removeTodo = (index: number) => {
    const newTodos = [...todos];
    newTodos.splice(index, 1);
    setTodos(newTodos);
  };

  return (
    <div className="container-sm">
      <form onSubmit={handleSubmit(addTodo)}>
        <div className="input-group my-5 ps-2 pe-2">
          <input {...register("task")} type="text" className="form-control" />
          <button
            className="btn btn-outline-secondary"
            type="submit"
            id="button-add"
          >
            Add
          </button>
        </div>
        {errors.task && (
          <p className="text-danger mb-3 p-3">{errors.task.message}</p>
        )}
      </form>
      <ul className="list-group mt-2 mx-2">
        {todos.map((todo) => (
          <li
            className="list-group-item form-check py-2 px-4 d-flex justify-content-between"
            key={todo.id}
          >
            <p className="mt-3 ms-3">
              <input
                onClick={() => updateTodo(todo)}
                className="form-check-input p-2"
                type="checkbox"
              />
              <label className="form-check-label ms-2">
                {!todo.status ? (
                  <span className="text-decoration-line-through">
                    {todo.task}
                  </span>
                ) : (
                  todo.task
                )}
              </label>
            </p>
            <button
              onClick={() => deleteTodo(todo)}
              type="button"
              className="btn btn-outline-danger"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

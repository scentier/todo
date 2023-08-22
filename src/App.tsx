import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const TodoSchema = z.object({
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
  // set the state to array, but it doesn't know what inside that array, so it treat the sate as never[]
  const [todos, setTodos] = useState<TTodoSchema[]>([]);

  const checkedDo = (index: number) => {
    const newTodos = [...todos];
    newTodos[index].status = !todos[index].status;
    setTodos(newTodos);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit((data) => {
          setTodos([...todos, { status: data.status, task: data.task }]);
          console.log(data);
          reset();
        })}
      >
        <div className="input-group mt-3 ps-2 pe-2">
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
      <div className="container-fluid mt-2">
        {todos.map((todo, index) => (
          <div className="form-check py-2 px-4" key={index}>
            <input
              onClick={() => checkedDo(index)}
              className="form-check-input p-2"
              type="checkbox"
            />
            <label className="form-check-label">
              {!todo.status ? (
                <span className="text-decoration-line-through">
                  {todo.task}
                </span>
              ) : (
                todo.task
              )}
            </label>
          </div>
        ))}
      </div>
    </>
  );
};

export default App;

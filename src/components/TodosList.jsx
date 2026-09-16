import { useContext } from "react";
import { TodosCtx } from "../contextes/todos.context";


export function TodosList() {
  const {todosList} = useContext(TodosCtx);

  return (
    <>
      <ul>
        {todosList?.map((todo, id) => <li key={id}>
          {todo.title} <button onClick={()=> {}}>x</button>
        </li>)}
      </ul>
    </>
  );
}
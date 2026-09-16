import { useContext, useState } from "react";
import { TodosCtx } from "../contextes/todos.context";

export function TodoForm() {
  const [todoTitle, setTodoTitle] = useState('');
  const { addToFirebase } = useContext(TodosCtx);
  
  // save to firebase
  const handleAddTodo = () => {
    addToFirebase(todoTitle);
  }

  return (
    <div>
      <span>Title</span>
      <input 
        name="title" 
        onKeyUp={(event)=> setTodoTitle(event.target.value)} />
      <br/>
      <button onClick={()=> addToFirebase(todoTitle)}>add</button>
    </div>);
}
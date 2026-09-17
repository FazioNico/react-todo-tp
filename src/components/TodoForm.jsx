import { useContext, useState } from "react";
import { TodosCtx } from "../contextes/todos.context";
import { UserCtx } from "../contextes/user.context";

export function TodoForm() {
  const [todoTitle, setTodoTitle] = useState('');
  const { addToFirebase } = useContext(TodosCtx);
  const { currentUser } = useContext(UserCtx);
  
  // save to firebase
  const handleAddTodo = () => {
    if (!currentUser?.uid) {
      throw new Error('No user found');
    }
    addToFirebase(currentUser.uid, todoTitle);
  }

  return (
    <div>
      <span>Title</span>
      <input 
        name="title" 
        onKeyUp={(event)=> setTodoTitle(event.target.value)} />
      <br/>
      <button onClick={()=> handleAddTodo()}>add</button>
    </div>);
}
import { createContext, useEffect, useState } from "react";
import { addToFirebase, collection } from "../services/firebase/firebase";
import { onValue } from "firebase/database";

export const TodosCtx = createContext([]);

export function TodosProvider({ children }) {
  const [todosList, setTodosList] = useState([]);

  // realtime data from firebase
  useEffect(() => {
    onValue(collection, (snap)=> {
      const todosObject = snap.val();
      const todoArray = Object.entries(todosObject).map(([id, todo]) => ({
        id,
        ...todo
      }));
      console.log(todoArray)
      setTodosList(todoArray); 
    })
  }, []);

  return (
    <TodosCtx.Provider value={{ todosList, addToFirebase, }}>
      {children}
    </TodosCtx.Provider>
  );
}

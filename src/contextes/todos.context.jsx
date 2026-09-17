import { createContext, useContext, useEffect, useState } from "react";
import { addToFirebase, collection } from "../services/firebase/firebase";
import { child, onValue } from "firebase/database";
import { UserCtx } from "./user.context";

export const TodosCtx = createContext([]);

export function TodosProvider({ children }) {
  const [todosList, setTodosList] = useState([]);
  const { currentUser } = useContext(UserCtx);

  // realtime data from firebase
  useEffect(() => {
    if (!currentUser?.uid) {
      return;
    }
    onValue(child(collection, currentUser.uid), (snap)=> {
      const todosObject = snap.val();
      const todoArray = Object.entries(todosObject).map(([id, todo]) => ({
        id,
        ...todo
      }));
      console.log(todoArray)
      setTodosList(todoArray); 
    })
  }, [currentUser]);

  return (
    <TodosCtx.Provider value={{ todosList, addToFirebase, }}>
      {children}
    </TodosCtx.Provider>
  );
}

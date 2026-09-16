import { createContext, useEffect, useState } from "react";
import { auth, signinWithGoogle } from "../services/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const UserCtx = createContext(null);

export function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(()=> {
    onAuthStateChanged(auth, (user)=> {
      setCurrentUser(user || null);
    });
  }, []);

  const signIn = async () => {
    await signinWithGoogle();
  }

  const logOut = () => {
    signOut(auth);
  }

  return <UserCtx.Provider value={{currentUser, signIn, logOut }} >
    {children}
  </UserCtx.Provider>
}
import { createContext, useEffect, useState } from "react";
import { auth, isAdmin, signinWithEmailAndPass, signinWithGoogle } from "../services/firebase/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export const UserCtx = createContext(null);

export function UserProvider({children}) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false);

  useEffect(()=> {
    onAuthStateChanged(auth, async(user)=> {
      setCurrentUser(user || null);
      if (!user) {
        return;
      }
      const result = await isAdmin(user.uid);
      setIsUserAdmin(result);
    });
  }, []);

  const signIn = async () => {
    await signinWithGoogle();
  }

  const signInWithEmail = (email, pass) => signinWithEmailAndPass(email, pass)

  const logOut = () => {
    signOut(auth);
  }

  return <UserCtx.Provider value={{currentUser, signIn, logOut, signInWithEmail, isUserAdmin }} >
    {children}
  </UserCtx.Provider>
}
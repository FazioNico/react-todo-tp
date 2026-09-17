// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { child, get, getDatabase, push, ref } from "firebase/database";
import { EmailAuthProvider, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword, signInAnonymously } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);

export const collection = ref(database, 'tp-todos-react');

export const addToFirebase = async (uid, title) => {
  await push(child(collection, uid), {
    title,
    createAt: new Date().toISOString()
  });
}

export const signinWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}

export const signinWithEmailAndPass = async (email, pass) => {
  console.log(email, pass)
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}

export const signinAsAnonymous = async () => {
  await signInAnonymously(auth);
}

export const isAdmin = async (userId) => {
  const collection = ref(database, 'userAdmin');
  const admin = await get(collection).then(snap => snap.val());
  return admin[userId] ? true : false;
}
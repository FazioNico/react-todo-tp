// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
import { getDatabase, push, ref } from "firebase/database";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export const collection = ref(database, 'tp-todos-react');

export const addToFirebase = async (title) => {
  await push(collection, {
    title,
    createAt: new Date().toISOString()
  });
}
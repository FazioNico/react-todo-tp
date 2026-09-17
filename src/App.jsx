import { useContext, useState } from 'react'
import { TodoForm } from './components/TodoForm'
import { TodosList } from './components/TodosList'
import { UserCtx } from './contextes/user.context';
import { UploadFile } from './components/UploadFile';

function App() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const { currentUser, signIn, logOut, signInWithEmail, isUserAdmin } = useContext(UserCtx);

  return (
    <>
      <UploadFile />
      <p>currentUser: {currentUser?.email || 'no user'} is Admin: {isUserAdmin ? 'true' : 'false'}</p>
      <input type="text" onKeyUp={(event) => setEmail(event.target.value)} />
      <input type="text" onKeyUp={(event) => setPass(event.target.value)} />
      <button onClick={()=> signInWithEmail(email, pass)}>auth with Email</button>
      <button onClick={()=> signIn()}>auth with Google</button>
      <button onClick={()=> logOut()}>logout</button>
      <TodoForm />
      <TodosList />
    </>
  )
}

export default App

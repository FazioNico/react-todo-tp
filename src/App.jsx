import { useContext } from 'react'
import { TodoForm } from './components/TodoForm'
import { TodosList } from './components/TodosList'
import { UserCtx } from './contextes/user.context';

function App() {
  const { currentUser, signIn, logOut } = useContext(UserCtx);

  return (
    <>
      <p>currentUser: {currentUser?.displayName || 'no user'}</p>
      <button onClick={()=> signIn()}>auth with Google</button>
      <button onClick={()=> logOut()}>logout</button>
      <TodoForm />
      <TodosList />
    </>
  )
}

export default App

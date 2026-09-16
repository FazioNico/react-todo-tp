import { TodoForm } from './components/TodoForm'
import { TodosList } from './components/TodosList'
import { signinWithGoogle } from './services/firebase/firebase'

function App() {

  return (
    <>
      <button onClick={()=> signinWithGoogle()}>auth with Google</button>
      <TodoForm />
      <TodosList />
    </>
  )
}

export default App

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TodosProvider } from './contextes/todos.context.jsx'
import { UserProvider } from './contextes/user.context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <TodosProvider>
        <App />
      </TodosProvider>
    </UserProvider>
  </StrictMode>,
)

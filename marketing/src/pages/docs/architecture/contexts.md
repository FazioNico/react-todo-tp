---
layout: ../../../layouts/DocsLayout.astro
title: Contextes React
description: Gestion d'état avec Context API
---

## Vue d'ensemble

React Todo App utilise deux contextes principaux pour gérer l'état global de l'application.

## UserContext

Gère l'authentification et les informations utilisateur.

### State

```javascript
{
  currentUser: {
    uid: string,
    email: string,
    displayName: string,
    photoURL: string
  } | null,
  isUserAdmin: boolean
}
```

### Méthodes

```javascript
// Connexion avec Google OAuth
await signIn()

// Connexion avec email/mot de passe
await signInWithEmail(email: string, password: string)

// Déconnexion
await logOut()
```

### Utilisation

```javascript
import { useContext } from 'react'
import { UserCtx } from './contextes/user.context'

function MyComponent() {
  const { currentUser, isUserAdmin, signIn, logOut } = useContext(UserCtx)
  
  return (
    <div>
      {currentUser ? (
        <>
          <p>Connecté : {currentUser.email}</p>
          <button onClick={logOut}>Déconnexion</button>
        </>
      ) : (
        <button onClick={signIn}>Se connecter</button>
      )}
    </div>
  )
}
```

### Fonctionnement interne

1. **Auto-connexion anonyme** : Au démarrage, les utilisateurs se connectent anonymement
2. **Écoute des changements** : `onAuthStateChanged` détecte les modifications
3. **Vérification admin** : Après connexion, vérifie si l'utilisateur est admin
4. **Persistance** : Firebase persiste automatiquement la session

```javascript
export function UserProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [isUserAdmin, setIsUserAdmin] = useState(false)

  useEffect(() => {
    // Auto sign-in anonymously
    signinAsAnonymous()

    // Listen for auth changes
    onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user || null)
      
      if (user) {
        const admin = await isAdmin(user.uid)
        setIsUserAdmin(admin)
      }
    })
  }, [])

  // ... provide context
}
```

## TodosContext

Gère la liste des tâches et leur synchronisation avec Firebase.

### State

```javascript
{
  todosList: Array<{
    id: string,
    title: string,
    createAt: string
  }>
}
```

### Méthodes

```javascript
// Ajouter une tâche à Firebase
await addToFirebase(uid: string, title: string)
```

### Utilisation

```javascript
import { useContext } from 'react'
import { TodosCtx } from './contextes/todos.context'
import { UserCtx } from './contextes/user.context'

function TodoForm() {
  const { todosList, addToFirebase } = useContext(TodosCtx)
  const { currentUser } = useContext(UserCtx)
  const [title, setTitle] = useState('')

  const handleAdd = () => {
    addToFirebase(currentUser.uid, title)
    setTitle('')
  }

  return (
    <>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle tâche..."
      />
      <button onClick={handleAdd}>Ajouter</button>
      
      <ul>
        {todosList.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  )
}
```

### Fonctionnement interne

1. **Écoute en temps réel** : Utilise `onValue` de Firebase
2. **Transformation des données** : Convertit l'objet Firebase en tableau
3. **Mise à jour automatique** : À chaque modification, met à jour l'état
4. **Filtrage par utilisateur** : N'affiche que les tâches de l'utilisateur connecté

```javascript
export function TodosProvider({ children }) {
  const [todosList, setTodosList] = useState([])
  const { currentUser } = useContext(UserCtx)

  useEffect(() => {
    if (!currentUser?.uid) return

    // Listen to user's todos in real-time
    onValue(child(collection, currentUser.uid), (snap) => {
      const todosObject = snap.val()
      const todoArray = Object.entries(todosObject || {})
        .map(([id, todo]) => ({
          id,
          ...todo
        }))
      setTodosList(todoArray)
    })
  }, [currentUser])

  // ... provide context
}
```

## Hiérarchie des Providers

Pour que les contextes fonctionnent, ils doivent être enveloppés dans `main.jsx` :

```javascript
// main.jsx
import { UserProvider } from './contextes/user.context'
import { TodosProvider } from './contextes/todos.context'
import App from './App'

ReactDOM.render(
  <UserProvider>
    <TodosProvider>
      <App />
    </TodosProvider>
  </UserProvider>,
  document.getElementById('root')
)
```

⚠️ **Important** : `TodosProvider` dépend de `UserProvider`, donc `UserProvider` doit être parent.

## Bonnes pratiques

### ✅ Utiliser le contexte directement

```javascript
// Bon
const { currentUser } = useContext(UserCtx)
```

### ❌ Ne pas dupliquer l'état

```javascript
// Mauvais - l'état devient désynchronisé
const { currentUser } = useContext(UserCtx)
const [localUser, setLocalUser] = useState(currentUser)
```

### ✅ Vérifier la présence avant d'utiliser

```javascript
if (!currentUser?.uid) {
  return <p>Veuillez vous connecter</p>
}
```

### ❌ Ne pas utiliser le contexte hors des composants

```javascript
// Mauvais - useContext ne fonctionne que dans les composants
const handleClick = () => {
  const { currentUser } = useContext(UserCtx) // ERREUR
}
```

## Améliorations futures

Considérez ces évolutions :

1. **useUser hook** : Créer un hook personnalisé
   ```javascript
   export function useUser() {
     return useContext(UserCtx)
   }
   ```

2. **useReducer** : Pour une logique plus complexe
   ```javascript
   const [state, dispatch] = useReducer(userReducer, initialState)
   ```

3. **Redux/Zustand** : Si l'état devient trop complexe

4. **Error handling** : Améliorer la gestion des erreurs
   ```javascript
   const [error, setError] = useState(null)
   
   try {
     await signIn()
   } catch (err) {
     setError(err.message)
   }
   ```

---

**Passons à** → [Composants](/docs/components/app)

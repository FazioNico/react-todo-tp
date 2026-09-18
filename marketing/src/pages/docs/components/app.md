---
layout: ../../../layouts/DocsLayout.astro
title: Composant App
description: Le composant racine de l'application
---

## Vue d'ensemble

Le composant `App` est le composant racine qui assemble tous les autres. Il gère l'interface principale et orchestre les interactions utilisateur.

## Structure

```javascript
function App() {
  return (
    <>
      <UploadFile />
      <p>currentUser: {currentUser?.email} is Admin: {isUserAdmin}</p>
      <input /> {/* email */}
      <input /> {/* password */}
      <button>auth with Email</button>
      <button>auth with Google</button>
      <button>logout</button>
      <TodoForm />
      <TodosList />
    </>
  )
}
```

## Code source

```javascript
import { useContext, useState } from 'react'
import { TodoForm } from './components/TodoForm'
import { TodosList } from './components/TodosList'
import { UserCtx } from './contextes/user.context'
import { UploadFile } from './components/UploadFile'

function App() {
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const { currentUser, signIn, logOut, signInWithEmail, isUserAdmin } = 
    useContext(UserCtx)

  return (
    <>
      <UploadFile />
      <p>
        currentUser: {currentUser?.email || 'no user'} 
        is Admin: {isUserAdmin ? 'true' : 'false'}
      </p>
      <input 
        type="text" 
        onKeyUp={(event) => setEmail(event.target.value)} 
      />
      <input 
        type="text" 
        onKeyUp={(event) => setPass(event.target.value)} 
      />
      <button onClick={() => signInWithEmail(email, pass)}>
        auth with Email
      </button>
      <button onClick={() => signIn()}>
        auth with Google
      </button>
      <button onClick={() => logOut()}>
        logout
      </button>
      <TodoForm />
      <TodosList />
    </>
  )
}

export default App
```

## État local

```javascript
const [email, setEmail] = useState('')    // Email pour connexion
const [pass, setPass] = useState('')      // Mot de passe pour connexion
```

## Contextes utilisés

```javascript
const { 
  currentUser,      // Utilisateur connecté
  signIn,           // Connexion Google
  logOut,           // Déconnexion
  signInWithEmail,  // Connexion par email
  isUserAdmin       // Vérifier si admin
} = useContext(UserCtx)
```

## Enfants rendus

### 1. UploadFile
Composant pour télécharger des fichiers compressés.

### 2. Affichage de l'utilisateur
```javascript
<p>currentUser: {currentUser?.email || 'no user'} is Admin: {isUserAdmin ? 'true' : 'false'}</p>
```

Affiche :
- L'email de l'utilisateur connecté
- S'il est admin

### 3. Formulaire d'authentification

#### Email/Password
```javascript
<input onKeyUp={(event) => setEmail(event.target.value)} />
<input onKeyUp={(event) => setPass(event.target.value)} />
<button onClick={() => signInWithEmail(email, pass)}>
  auth with Email
</button>
```

#### Google OAuth
```javascript
<button onClick={() => signIn()}>
  auth with Google
</button>
```

#### Déconnexion
```javascript
<button onClick={() => logOut()}>
  logout
</button>
```

### 4. TodoForm
Composant pour créer une nouvelle tâche.

### 5. TodosList
Composant pour afficher la liste des tâches.

## Flux de l'application

```
Démarrage
  ↓
UserProvider auto-connect anonyme
  ↓
App rendu
  ↓
Utilisateur interagit
  ├─ Clique "auth with Google"
  │  → appelle signIn()
  │  → UserContext met à jour currentUser
  │  → App re-render
  │
  ├─ Ajoute une tâche
  │  → TodoForm appelle addToFirebase
  │  → Firebase sauvegarde
  │  → TodosContext reçoit la mise à jour
  │  → TodosList re-render
  │
  └─ Clique "logout"
     → appelle logOut()
     → Firebase met à jour
     → currentUser devient null
     → App re-render
```

## Améliorations recommandées

### 1. Organiser en sous-composants

```javascript
function App() {
  return (
    <>
      <UploadFile />
      <AuthSection />  {/* Nouveau composant */}
      <TodosSection /> {/* Nouveau composant */}
    </>
  )
}
```

### 2. Ajouter du styling

```javascript
<div className="app-container">
  <header className="app-header">
    <AuthSection />
  </header>
  <main className="app-main">
    <TodosSection />
  </main>
</div>
```

### 3. Ajouter une gestion d'erreurs

```javascript
const [error, setError] = useState(null)

const handleSignIn = async () => {
  try {
    await signInWithEmail(email, pass)
  } catch (err) {
    setError(err.message)
  }
}

{error && <p className="error">{error}</p>}
```

### 4. Ajouter un Loading state

```javascript
const [loading, setLoading] = useState(false)

const handleSignIn = async () => {
  setLoading(true)
  try {
    await signInWithEmail(email, pass)
  } finally {
    setLoading(false)
  }
}

<button disabled={loading}>
  {loading ? 'Connexion...' : 'Se connecter'}
</button>
```

## Lifecycle

```
Component Mount
  ↓
UserProvider init (auto-connect anonym)
  ↓
App render avec currentUser = null
  ↓
Auth state changes
  ↓
App re-render avec currentUser
  ↓
Component Unmount
```

---

**Suivant ?** [→ TodoForm](/docs/components/todo-form)

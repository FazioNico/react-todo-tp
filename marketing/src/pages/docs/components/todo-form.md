---
layout: ../../../layouts/DocsLayout.astro
title: Composant TodoForm
description: Formulaire d'ajout de tâche
---

## Vue d'ensemble

Le composant `TodoForm` permet aux utilisateurs de créer une nouvelle tâche et de la sauvegarder dans Firebase.

## Code source

```javascript
import { useContext, useState } from "react";
import { TodosCtx } from "../contextes/todos.context";
import { UserCtx } from "../contextes/user.context";

export function TodoForm() {
  const [todoTitle, setTodoTitle] = useState('');
  const { addToFirebase } = useContext(TodosCtx);
  const { currentUser } = useContext(UserCtx);
  
  const handleAddTodo = () => {
    if (!currentUser?.uid) {
      throw new Error('No user found');
    }
    addToFirebase(currentUser.uid, todoTitle);
  }

  return (
    <div>
      <span>Title</span>
      <input 
        name="title" 
        onKeyUp={(event) => setTodoTitle(event.target.value)} 
      />
      <br/>
      <button onClick={() => handleAddTodo()}>add</button>
    </div>
  );
}
```

## État local

```javascript
const [todoTitle, setTodoTitle] = useState('')
```

Stocke le titre de la tâche en cours de saisie.

## Contextes utilisés

```javascript
const { addToFirebase } = useContext(TodosCtx)    // Ajouter tâche
const { currentUser } = useContext(UserCtx)       // Vérifier l'utilisateur
```

## Interaction utilisateur

### 1. Saisir un titre

```javascript
<input 
  name="title" 
  onKeyUp={(event) => setTodoTitle(event.target.value)} 
/>
```

À chaque touche pressée, met à jour l'état local.

### 2. Cliquer "add"

```javascript
<button onClick={() => handleAddTodo()}>add</button>
```

Lance la fonction `handleAddTodo`.

### 3. Sauvegarder en Firebase

```javascript
const handleAddTodo = () => {
  if (!currentUser?.uid) {
    throw new Error('No user found');
  }
  addToFirebase(currentUser.uid, todoTitle);
}
```

- Vérifie que l'utilisateur est connecté
- Appelle `addToFirebase` avec l'UID et le titre
- La tâche est sauvegardée dans Firebase

## Flux

```
Utilisateur saisit "Faire les courses"
  ↓
setTodoTitle("Faire les courses")
  ↓
État du composant mis à jour
  ↓
Utilisateur clique "add"
  ↓
handleAddTodo() appelée
  ↓
Vérification : currentUser?.uid existe?
  ├─ OUI : appelle addToFirebase(uid, title)
  │        Firebase crée la tâche
  │        TodosContext reçoit la mise à jour
  │        TodosList re-render
  │
  └─ NON : Lance une erreur
```

## Améliorations recommandées

### 1. Vider le champ après ajout

```javascript
const handleAddTodo = async () => {
  if (!currentUser?.uid) {
    throw new Error('No user found');
  }
  await addToFirebase(currentUser.uid, todoTitle);
  setTodoTitle('');  // Vider le champ
}
```

### 2. Valider le titre

```javascript
const handleAddTodo = () => {
  if (!todoTitle.trim()) {
    alert('Le titre ne peut pas être vide');
    return;
  }
  if (!currentUser?.uid) {
    throw new Error('No user found');
  }
  addToFirebase(currentUser.uid, todoTitle.trim());
  setTodoTitle('');
}
```

### 3. Gérer les erreurs

```javascript
const [error, setError] = useState(null);

const handleAddTodo = async () => {
  try {
    setError(null);
    if (!todoTitle.trim()) {
      throw new Error('Le titre ne peut pas être vide');
    }
    if (!currentUser?.uid) {
      throw new Error('Vous devez être connecté');
    }
    await addToFirebase(currentUser.uid, todoTitle);
    setTodoTitle('');
  } catch (err) {
    setError(err.message);
  }
}

return (
  <div>
    {error && <p style={{ color: 'red' }}>{error}</p>}
    <input value={todoTitle} onChange={(e) => setTodoTitle(e.target.value)} />
    <button onClick={handleAddTodo}>Ajouter</button>
  </div>
)
```

### 4. Ajouter un Loading state

```javascript
const [loading, setLoading] = useState(false);

const handleAddTodo = async () => {
  setLoading(true);
  try {
    await addToFirebase(currentUser.uid, todoTitle);
    setTodoTitle('');
  } finally {
    setLoading(false);
  }
}

<button onClick={handleAddTodo} disabled={loading}>
  {loading ? 'Ajout...' : 'Ajouter'}
</button>
```

### 5. Ajouter le support de la touche Entrée

```javascript
const handleKeyPress = (e) => {
  if (e.key === 'Enter') {
    handleAddTodo();
  }
}

<input 
  value={todoTitle}
  onChange={(e) => setTodoTitle(e.target.value)}
  onKeyPress={handleKeyPress}
  placeholder="Nouvelle tâche..."
/>
```

### 6. Styling

```javascript
return (
  <div className="todo-form">
    <input 
      className="todo-input"
      placeholder="Nouvelle tâche..."
      value={todoTitle}
      onChange={(e) => setTodoTitle(e.target.value)}
      onKeyPress={handleKeyPress}
    />
    <button className="todo-button" onClick={handleAddTodo}>
      Ajouter
    </button>
  </div>
)
```

## Cas d'utilisation

### ✅ Cas de succès

1. Utilisateur connecté avec UID valide
2. Titre non vide
3. Tâche créée dans Firebase
4. Liste mise à jour automatiquement

### ❌ Cas d'erreur

1. Utilisateur non connecté → Erreur : "No user found"
2. Titre vide → Pas de création (peut ajouter validation)
3. Erreur Firebase → Remontée automatiquement

## Points clés

- ✅ Vérifie toujours que l'utilisateur est connecté
- ✅ Utilise `currentUser?.uid` pour accéder en toute sécurité
- ✅ Appelle `addToFirebase` du contexte, pas directement le service
- ❌ Ne valide pas actuellement l'entrée utilisateur
- ❌ N'affiche pas les erreurs en cas d'échec

---

**Suivant ?** [→ TodosList](/docs/components/todos-list)

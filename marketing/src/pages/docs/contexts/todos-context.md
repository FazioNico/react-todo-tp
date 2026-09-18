---
layout: ../../../layouts/DocsLayout.astro
title: TodosContext
description: Gestion de l'état des tâches en temps réel
---

## Vue d'ensemble

`TodosContext` gère la liste des tâches de l'utilisateur connecté. Il offre une synchronisation en temps réel avec Firebase Realtime Database.

## Utilisation

### Récupérer le contexte

```javascript
import { useContext } from 'react';
import { TodosCtx } from '../contextes/todos.context';

function MyComponent() {
  const { todosList, addToFirebase } = useContext(TodosCtx);
  
  // ...
}
```

## API

### `todosList`

Tableau contenant toutes les tâches de l'utilisateur connecté.

**Type** :
```javascript
Array<{
  id: string,           // ID unique Firebase
  title: string,        // Titre de la tâche
  createAt: string,     // Date ISO de création
}>
```

**Exemple** :
```javascript
console.log(todosList);
// [
//   { id: '-todo1', title: 'Faire les courses', createAt: '2024-01-15T10:30:00Z' },
//   { id: '-todo2', title: 'Appeler le plombier', createAt: '2024-01-16T14:20:00Z' }
// ]
```

### `addToFirebase(uid, title)`

Ajoute une nouvelle tâche à la base de données.

**Signature** :
```javascript
async function addToFirebase(
  uid: string,
  title: string
): Promise<void>
```

**Paramètres** :
- `uid` : ID unique de l'utilisateur
- `title` : Titre de la tâche

**Exemple** :
```javascript
const { currentUser } = useContext(UserCtx);
const { addToFirebase } = useContext(TodosCtx);

const handleAddTodo = async () => {
  await addToFirebase(currentUser.uid, 'Ma nouvelle tâche');
};
```

**Données créées** :
```json
{
  "tp-todos-react": {
    "user123": {
      "-pushId123": {
        "title": "Ma nouvelle tâche",
        "createAt": "2024-01-17T09:15:00Z"
      }
    }
  }
}
```

## Cycle de vie

### Initialisation

```javascript
useEffect(() => {
  // 1. Vérifie que l'utilisateur est connecté
  if (!currentUser?.uid) {
    return;
  }
  
  // 2. Crée un écouteur Firebase en temps réel
  const unsubscribe = onValue(
    child(collection, currentUser.uid),
    (snapshot) => {
      // 3. Récupère les données
      const todosObject = snapshot.val();
      
      // 4. Convertit l'objet en tableau
      const todoArray = Object.entries(todosObject || {})
        .map(([id, todo]) => ({
          id,
          ...todo
        }));
      
      // 5. Met à jour l'état
      setTodosList(todoArray);
    }
  );
  
  // 6. Nettoyage : arrête l'écouteur quand l'utilisateur change
  return () => unsubscribe?.();
}, [currentUser]);
```

## Exemples d'utilisation

### Afficher la liste des tâches

```javascript
function TodosList() {
  const { todosList } = useContext(TodosCtx);
  
  return (
    <ul>
      {todosList?.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
}
```

### Ajouter une tâche

```javascript
function TodoForm() {
  const { currentUser } = useContext(UserCtx);
  const { addToFirebase } = useContext(TodosCtx);
  const [title, setTitle] = useState('');
  
  const handleAdd = async () => {
    if (!title.trim()) return;
    
    await addToFirebase(currentUser.uid, title);
    setTitle('');  // Vider le champ
  };
  
  return (
    <>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Nouvelle tâche..."
      />
      <button onClick={handleAdd}>Ajouter</button>
    </>
  );
}
```

### Afficher le nombre de tâches

```javascript
function TodosCount() {
  const { todosList } = useContext(TodosCtx);
  
  return <p>{todosList?.length || 0} tâches</p>;
}
```

### Chercher des tâches

```javascript
function SearchTodos() {
  const { todosList } = useContext(TodosCtx);
  const [search, setSearch] = useState('');
  
  const filtered = todosList?.filter(todo =>
    todo.title.toLowerCase().includes(search.toLowerCase())
  ) || [];
  
  return (
    <>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher..."
      />
      <p>Résultats : {filtered.length}</p>
      <ul>
        {filtered.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}
```

### Trier les tâches

```javascript
function SortedTodos() {
  const { todosList } = useContext(TodosCtx);
  const [sortBy, setSortBy] = useState('newest');
  
  const sorted = [...(todosList || [])].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createAt) - new Date(a.createAt);
    } else if (sortBy === 'oldest') {
      return new Date(a.createAt) - new Date(b.createAt);
    } else if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
  
  return (
    <>
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Plus récent</option>
        <option value="oldest">Plus ancien</option>
        <option value="title">Titre (A-Z)</option>
      </select>
      <ul>
        {sorted.map((todo) => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </>
  );
}
```

## Synchronisation en temps réel

### Comment ça fonctionne

```javascript
// Utilisateur A ajoute une tâche
await addToFirebase(uid_a, 'Faire les courses');

// Firebase Realtime Database mise à jour
// ↓
// Tous les écouteurs sont notifiés
// ↓
// todosList mis à jour pour tous les clients
// ↓
// Composants re-rendent automatiquement
```

### Multi-onglets

Si l'utilisateur ouvre deux onglets :
- Onglet 1 ajoute une tâche
- Onglet 2 reçoit la mise à jour **automatiquement**
- Les deux onglets affichent la liste identique

## Bonnes pratiques

### ✅ À faire

```javascript
// Vérifier que l'utilisateur est connecté avant d'ajouter
if (!currentUser?.uid) {
  return;
}
await addToFirebase(currentUser.uid, title);

// Valider l'entrée
if (!title.trim()) {
  return;
}

// Vider le champ après ajout
await addToFirebase(currentUser.uid, title);
setTitle('');
```

### ❌ À éviter

```javascript
// Sans vérification d'utilisateur
await addToFirebase(undefined, title); // ERREUR

// Sans validation
await addToFirebase(uid, ''); // Crée une tâche vide

// Dupliquer l'état
const [localTodos, setLocalTodos] = useState([]);
// Se désynchronise rapidement
```

## Limitations actuelles

- ❌ Pas de suppression de tâche
- ❌ Pas de modification de tâche
- ❌ Pas de marquage comme terminée
- ❌ Pas d'ordonnancement manuel (drag & drop)

## Améliorations suggérées

### 1. Ajouter la suppression

```javascript
export const deleteTodo = async (uid, todoId) => {
  const todoRef = child(collection, `${uid}/${todoId}`);
  await remove(todoRef);
}

// Puis ajouter au contexte
<button onClick={() => deleteTodo(uid, todo.id)}>Supprimer</button>
```

### 2. Ajouter la modification

```javascript
export const updateTodo = async (uid, todoId, updates) => {
  const todoRef = child(collection, `${uid}/${todoId}`);
  await update(todoRef, updates);
}

// Utilisation
await updateTodo(uid, todoId, { title: 'Nouveau titre' });
```

### 3. Ajouter le statut de complétion

```javascript
// Ajouter completedAt à la structure
const todo = {
  title: 'Ma tâche',
  createAt: '2024-01-17T...',
  completedAt: null  // null si non complétée, timestamp sinon
};

// Puis afficher avec un style
<span style={todo.completedAt ? { textDecoration: 'line-through' } : {}}>
  {todo.title}
</span>
```

### 4. Ajouter la pagination

```javascript
import { query, limitToLast } from "firebase/database";

const getTodosPage = async (uid, pageSize = 20) => {
  const todosQuery = query(
    child(collection, uid),
    limitToLast(pageSize)
  );
  return get(todosQuery);
};
```

### 5. Créer un hook personnalisé

```javascript
export function useTodos() {
  return useContext(TodosCtx);
}

// Utilisation
const { todosList, addToFirebase } = useTodos();
```

---

**Prochaine étape ?** [→ API Reference](/docs/resources/api-reference)

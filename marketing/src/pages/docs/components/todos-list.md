---
layout: ../../../layouts/DocsLayout.astro
title: Composant TodosList
description: Affichage de la liste des tâches
---

## Vue d'ensemble

Le composant `TodosList` affiche toutes les tâches de l'utilisateur connecté en temps réel depuis Firebase.

## Code source

```javascript
import { useContext } from "react";
import { TodosCtx } from "../contextes/todos.context";

export function TodosList() {
  const { todosList } = useContext(TodosCtx);

  return (
    <>
      <ul>
        {todosList?.map((todo, id) => (
          <li key={id}>
            {todo.title}
            <button onClick={() => {}}>x</button>
          </li>
        ))}
      </ul>
    </>
  );
}
```

## Contextes utilisés

```javascript
const { todosList } = useContext(TodosCtx)
```

Récupère la liste des tâches depuis `TodosContext`.

## Rendu

### Structure

```
<ul>
  {todosList.map(todo => (
    <li>
      {todo.title}
      <button>x</button> // Bouton de suppression (non fonctionnel)
    </li>
  ))}
</ul>
```

### Données affichées

Pour chaque tâche :
- **todo.title** : Le titre de la tâche
- **todo.id** : L'ID unique (utilisé comme clé)
- **todo.createAt** : Date de création (non affichée actuellement)

### Exemple de rendu

```
- Faire les courses [x]
- Appeler le plombier [x]
- Envoyer l'email [x]
```

## Cas d'utilisation

### Liste vide

Si `todosList` est vide ou `null` :

```javascript
todosList?.map(...) // L'optional chaining évite l'erreur
```

Affiche une liste vide sans erreur.

### Liste avec tâches

Affiche chaque tâche avec son titre et un bouton de suppression.

## Améliorations recommandées

### 1. Message "Aucune tâche"

```javascript
export function TodosList() {
  const { todosList } = useContext(TodosCtx);

  if (!todosList || todosList.length === 0) {
    return <p>Aucune tâche. Créez-en une !</p>;
  }

  return (
    <ul>
      {todosList.map((todo) => (
        <li key={todo.id}>
          {todo.title}
          <button>x</button>
        </li>
      ))}
    </ul>
  );
}
```

### 2. Implémenter la suppression

```javascript
const { todosList, deleteTodo } = useContext(TodosCtx);

<button onClick={() => deleteTodo(todo.id)}>x</button>
```

Note : `deleteTodo` doit être implémenté dans `TodosContext`.

### 3. Afficher la date de création

```javascript
<li key={todo.id}>
  <div>
    <strong>{todo.title}</strong>
    <small>{new Date(todo.createAt).toLocaleDateString()}</small>
  </div>
  <button onClick={() => deleteTodo(todo.id)}>x</button>
</li>
```

### 4. Ajouter le statut de complétion

```javascript
// D'abord ajouter completedAt à la structure des tâches
// Puis afficher un checkbox

<li key={todo.id}>
  <input
    type="checkbox"
    checked={!!todo.completedAt}
    onChange={() => toggleTodo(todo.id)}
  />
  <span style={todo.completedAt ? { textDecoration: 'line-through' } : {}}>
    {todo.title}
  </span>
  <button onClick={() => deleteTodo(todo.id)}>x</button>
</li>
```

### 5. Ajouter le styling

```javascript
return (
  <ul className="todos-list">
    {todosList?.map((todo) => (
      <li key={todo.id} className="todo-item">
        <span className="todo-title">{todo.title}</span>
        <div className="todo-actions">
          <button 
            className="todo-delete" 
            onClick={() => deleteTodo(todo.id)}
            title="Supprimer"
          >
            ✕
          </button>
        </div>
      </li>
    ))}
  </ul>
);
```

### 6. Ajouter un tri et un filtre

```javascript
const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'title'
const [filter, setFilter] = useState('all');     // 'all', 'completed', 'pending'

const filteredTodos = todosList
  .filter(todo => {
    if (filter === 'completed') return !!todo.completedAt;
    if (filter === 'pending') return !todo.completedAt;
    return true;
  })
  .sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.createAt) - new Date(a.createAt);
    if (sortBy === 'oldest') return new Date(a.createAt) - new Date(b.createAt);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return 0;
  });

return (
  <>
    <div className="controls">
      <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
        <option value="newest">Plus récent</option>
        <option value="oldest">Plus ancien</option>
        <option value="title">Titre (A-Z)</option>
      </select>
      <select value={filter} onChange={(e) => setFilter(e.target.value)}>
        <option value="all">Toutes</option>
        <option value="completed">Complétées</option>
        <option value="pending">En attente</option>
      </select>
    </div>
    <ul className="todos-list">
      {filteredTodos.map((todo) => (
        // ... rendu du todo
      ))}
    </ul>
  </>
);
```

### 7. Afficher un compte

```javascript
const completedCount = todosList?.filter(t => !!t.completedAt).length || 0;
const totalCount = todosList?.length || 0;

return (
  <>
    <p>{completedCount} / {totalCount} tâches complétées</p>
    <ul>
      {/* ... */}
    </ul>
  </>
);
```

## Points clés

- ✅ Utilise l'optional chaining pour éviter les erreurs si `todosList` est null
- ✅ Utilise `todo.id` comme clé pour la liste (important pour React)
- ❌ N'affiche pas la date de création
- ❌ Le bouton de suppression n'est pas implémenté
- ❌ Pas de message si la liste est vide

## Performance

### Optimisations possibles

```javascript
// Mémoiser le composant si la liste est très grande
export const TodosList = React.memo(function TodosList() {
  // ...
});

// Ou utiliser useMemo pour le rendu
const renderedTodos = useMemo(
  () => todosList?.map(...),
  [todosList]
);
```

## Cycle de vie

```
Montage
  ↓
TodosContext notifie les changements
  ↓
todosList mis à jour
  ↓
Composant re-render
  ↓
Nouvelle liste affichée
```

---

**Suivant ?** [→ UploadFile](/docs/components/upload-file)

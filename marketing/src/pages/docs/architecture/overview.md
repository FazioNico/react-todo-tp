---
layout: ../../../layouts/DocsLayout.astro
title: Vue d'ensemble de l'architecture
description: Comprendre la structure générale de React Todo App
---

## Architecture générale

React Todo App suit une architecture modulaire et scalable avec une séparation claire des responsabilités.

```
┌─────────────────────────────────────────────────┐
│           Application React (App.jsx)            │
└──────────────┬──────────────────────────────────┘
               │
        ┌──────┴──────┬──────────────┐
        │             │              │
   ┌────▼────┐ ┌─────▼────┐ ┌──────▼────┐
   │ Contexts │ │Components│ │  Services │
   └────┬────┘ └─────┬────┘ └──────┬────┘
        │             │              │
        │    ┌────────┴─────────┐   │
        │    │                  │   │
        │ ┌──▼──┐ ┌──────┐     │   │
        │ │User │ │Todos │     │   │
        │ │     │ │      │     │   │
        │ └─────┘ └──────┘     │   │
        │                      │   │
        └──────────────┬───────┼───┘
                       │       │
                 ┌─────▼───────▼─────┐
                 │  Firebase (BaaS)  │
                 │ ┌────────────────┐│
                 │ │ Auth  │ DB  │ST││
                 │ └────────────────┘│
                 └───────────────────┘
```

## Couches de l'application

### 1. Présentation (Components)

Les composants React responsables de l'interface utilisateur :

- **App.jsx** - Composant racine
- **TodoForm.jsx** - Formulaire d'ajout de tâche
- **TodosList.jsx** - Affichage de la liste
- **UploadFile.jsx** - Gestion du téléchargement

### 2. Gestion d'état (Contexts)

Utilise Context API pour gérer l'état global :

- **UserContext** - Authentification et profil utilisateur
- **TodosContext** - Liste des tâches et opérations

### 3. Services

Les services encapsulent la logique métier et les appels externes :

- **firebase.js** - Intégration Firebase
- **Fonctions utilitaires** - Helpers et utilitaires

### 4. Backend (Firebase)

Services cloud managés :

- **Authentication** - Gestion des utilisateurs
- **Realtime Database** - Stockage des données
- **Storage** - Stockage des fichiers

## Flux de données

### Flux d'authentification

```
User clicks "Sign In"
     ↓
App component
     ↓
UserContext.signIn()
     ↓
firebase.signinWithGoogle()
     ↓
Firebase Auth
     ↓
onAuthStateChanged
     ↓
Update currentUser state
     ↓
Components re-render
```

### Flux de création de tâche

```
User enters title and clicks "Add"
     ↓
TodoForm.handleAddTodo()
     ↓
TodosContext.addToFirebase(uid, title)
     ↓
Firebase write to /tp-todos-react/{uid}/{todoId}
     ↓
onValue listener triggered
     ↓
TodosContext updates todosList
     ↓
TodosList component re-renders
```

## Communication inter-composants

```javascript
// App.jsx reçoit les données
const { currentUser } = useContext(UserCtx);
const { todosList } = useContext(TodosCtx);

// Pass to child components
<TodoForm /> // Has access via useContext
<TodosList /> // Has access via useContext
```

## Principes d'architecture

### ✅ Single Responsibility Principle

Chaque composant/contexte a une responsabilité unique :
- `UserContext` → Authentification
- `TodosContext` → Gestion des tâches
- `TodoForm` → Création de tâche
- `TodosList` → Affichage des tâches

### ✅ Separation of Concerns

```
Présentation → Logique → Données
Components  → Contexts → Firebase
```

### ✅ Réutilisabilité

Les contextes et services peuvent être utilisés par n'importe quel composant.

### ✅ Testabilité

Chaque couche peut être testée indépendamment.

## Dépendances entre modules

```
App.jsx
├── UserContext (User Management)
│   └── firebase.js (Auth Service)
├── TodosContext (Todos Management)
│   └── firebase.js (DB Service)
├── TodoForm (Component)
│   ├── TodosContext
│   └── UserContext
├── TodosList (Component)
│   └── TodosContext
└── UploadFile (Component)
    └── firebase.js
```

## Scalabilité

L'architecture est conçue pour croître :

- **Nouveaux contextes** : Ajouter facilement de nouveaux contextes
- **Nouveaux composants** : Isolés et réutilisables
- **Nouveaux services** : Encapsulés dans `src/services`
- **Nouvelles pages** : Possibilité de migrer vers un routeur (React Router)

---

**Prochaine étape ?** [→ Structure du projet](/docs/architecture/structure)

---
layout: ../../../layouts/DocsLayout.astro
title: Structure du projet
description: Organisation des fichiers et dossiers
---

## Structure des répertoires

```
react-todo-tp/
├── src/                          # Code source
│   ├── main.jsx                  # Point d'entrée
│   ├── App.jsx                   # Composant racine
│   ├── index.html                # HTML template
│   │
│   ├── components/               # Composants React
│   │   ├── App.jsx
│   │   ├── TodoForm.jsx
│   │   ├── TodosList.jsx
│   │   └── UploadFile.jsx
│   │
│   ├── contextes/                # Context API
│   │   ├── user.context.jsx      # Gestion authentification
│   │   └── todos.context.jsx     # Gestion des tâches
│   │
│   └── services/                 # Services & intégrations
│       └── firebase/
│           ├── firebase.js       # Configuration et fonctions
│           └── firebase.config.js # Variables de config
│
├── marketing/                    # Site de documentation (Astro)
│   ├── src/
│   │   ├── pages/               # Pages Astro
│   │   ├── layouts/             # Layouts réutilisables
│   │   └── components/          # Composants Astro
│   ├── public/                  # Assets statiques
│   ├── astro.config.mjs         # Configuration Astro
│   └── tailwind.config.mjs      # Configuration Tailwind
│
├── public/                       # Assets statiques
├── scripts/                      # Scripts utilitaires
│
├── package.json                  # Dépendances
├── vite.config.js               # Configuration Vite
├── .env                         # Variables d'environnement
├── .gitignore                   # Fichiers ignorés
└── README.md                    # Documentation
```

## Description des répertoires

### `/src`

Le code source principal de l'application React.

### `/src/components`

Tous les composants React fonctionnels :

```
components/
├── App.jsx              # Composant principal (pas vraiment un composant)
├── TodoForm.jsx         # Formulaire d'ajout
├── TodosList.jsx        # Liste affichée
└── UploadFile.jsx       # Upload de fichiers
```

### `/src/contextes`

Contextes React pour la gestion d'état globale :

```
contextes/
├── user.context.jsx     # { currentUser, signIn, logOut, ... }
└── todos.context.jsx    # { todosList, addToFirebase, ... }
```

### `/src/services`

Services encapsulant la logique métier :

```
services/
└── firebase/
    ├── firebase.js          # Fonctions Firebase
    └── firebase.config.js   # Configuration API
```

### `/public`

Fichiers statiques accessibles directement :

```
public/
├── favicon.svg
├── favicon.ico
└── ... autres assets
```

### `/marketing`

Site de documentation Astro avec structure séparate :

```
marketing/
├── src/
│   ├── pages/           # Pages Astro
│   ├── layouts/         # Layouts réutilisables
│   └── components/      # Composants Astro
├── astro.config.mjs     # Configuration
└── tailwind.config.mjs  # Styles
```

## Fichiers importants

### `package.json`

Définit les dépendances et scripts :

```json
{
  "scripts": {
    "dev": "vite",          // Dev server
    "build": "vite build",  // Production build
    "preview": "vite preview" // Preview build
  }
}
```

### `.env`

Variables d'environnement Firebase (non versionné) :

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
# etc.
```

### `vite.config.js`

Configuration du bundler :

```javascript
import react from '@vitejs/plugin-react'

export default {
  plugins: [react()],
}
```

## Naming conventions

### Composants

- **PascalCase** : `TodoForm.jsx`, `TodosList.jsx`
- **Répertoire** : `components/`

### Contextes

- **PascalCase avec suffixe** : `UserContext`, `TodosContext`
- **Fichier** : `user.context.jsx`, `todos.context.jsx`
- **Répertoire** : `contextes/`

### Services

- **camelCase** : `firebase.js`, `auth.js`
- **Répertoire** : `services/`

### Fichiers

- **camelCase** : `firebase.config.js`
- **Exceptions** : `App.jsx`, `index.html`

## Organisation recommandée

Pour ajouter une nouvelle fonctionnalité :

```
1. Créer le composant dans /components
   └── MyComponent.jsx

2. Si besoin d'état global, créer le contexte
   └── my.context.jsx

3. Si besoin de service externe
   └── services/my-service.js

4. Ajouter au layout principal (App.jsx)
```

### Exemple : Ajouter les commentaires

```
src/
├── components/
│   ├── CommentForm.jsx
│   ├── CommentsList.jsx
│   └── CommentItem.jsx
│
├── contextes/
│   └── comments.context.jsx
│
└── services/
    └── comments.js
```

## Dépendances critiques

```
React 19
├── react
├── react-dom
└── Context API (built-in)

Vite 8
├── @vitejs/plugin-react
└── Configuration bundler

Firebase 12
├── Authentication
├── Realtime Database
└── Storage

Compressor.js
└── Compression d'images

Development
├── oxlint
├── @types/react
└── JSDoc
```

## Convention de versionning

Le projet suit le **Semantic Versioning** :

- **0.0.1** → Première version
- **1.0.0** → Production ready
- **1.1.0** → Nouvelles features
- **1.1.1** → Bug fixes

---

**Suivant ?** [→ Contextes React](/docs/architecture/contexts)

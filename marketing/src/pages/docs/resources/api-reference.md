---
layout: ../../../layouts/DocsLayout.astro
title: API Reference
description: Référence complète de l'API
---

## Services Firebase

### addToFirebase(uid, title)

Ajoute une nouvelle tâche à la base de données.

```javascript
import { addToFirebase } from '../services/firebase/firebase';

await addToFirebase('user123', 'Faire les courses');
```

**Paramètres** :
- `uid: string` - ID unique de l'utilisateur
- `title: string` - Titre de la tâche

**Retour** : `Promise<void>`

**Erreurs** :
- `auth/permission-denied` - Pas d'autorisation
- `auth/network-request-failed` - Erreur réseau

---

### signinWithGoogle()

Authentification avec Google OAuth.

```javascript
import { signinWithGoogle } from '../services/firebase/firebase';

const user = await signinWithGoogle();
console.log(user.email);
```

**Paramètres** : Aucun

**Retour** : `Promise<FirebaseUser>`

**Propriétés du retour** :
```javascript
{
  uid: string,
  email: string,
  displayName: string,
  photoURL: string,
  isAnonymous: false
}
```

**Erreurs** :
- `auth/popup-closed-by-user`
- `auth/popup-blocked`
- `auth/network-request-failed`

---

### signinWithEmailAndPass(email, password)

Authentification/Inscription par email et mot de passe.

```javascript
import { signinWithEmailAndPass } from '../services/firebase/firebase';

const user = await signinWithEmailAndPass('user@gmail.com', 'password123');
```

**Paramètres** :
- `email: string` - Adresse email
- `password: string` - Mot de passe (min 6 caractères)

**Retour** : `Promise<FirebaseUser>`

**Erreurs** :
- `auth/weak-password` - Mot de passe < 6 caractères
- `auth/email-already-in-use` - Email existe déjà
- `auth/invalid-email` - Email invalide
- `auth/wrong-password` - Mot de passe incorrect
- `auth/user-not-found` - Utilisateur inexistant

---

### signinAsAnonymous()

Connexion anonyme sans identifiants.

```javascript
import { signinAsAnonymous } from '../services/firebase/firebase';

await signinAsAnonymous();
// L'utilisateur est maintenant connecté anonymement
```

**Paramètres** : Aucun

**Retour** : `Promise<void>`

---

### isAdmin(userId)

Vérifie si un utilisateur est administrateur.

```javascript
import { isAdmin } from '../services/firebase/firebase';

const admin = await isAdmin('user123');
if (admin) {
  console.log('Utilisateur est admin');
}
```

**Paramètres** :
- `userId: string` - ID unique de l'utilisateur

**Retour** : `Promise<boolean>`

---

## Firebase Exports

### auth

Instance Firebase Auth.

```javascript
import { auth } from '../services/firebase/firebase';

import { signOut } from 'firebase/auth';
await signOut(auth);
```

**Utilisation** : Opérations Firebase Auth avancées

---

### database

Instance Firebase Realtime Database.

```javascript
import { database } from '../services/firebase/firebase';

import { ref, get } from 'firebase/database';
const snapshot = await get(ref(database, 'path'));
```

**Utilisation** : Opérations database avancées

---

### storage

Instance Firebase Storage.

```javascript
import { storage } from '../services/firebase/firebase';

import { ref, uploadBytes } from 'firebase/storage';
const fileRef = ref(storage, 'files/user123/photo.jpg');
```

**Utilisation** : Opérations de fichiers

---

### collection

Référence à la collection principale de tâches.

```javascript
import { collection } from '../services/firebase/firebase';

// Pointe vers /tp-todos-react
```

**Structure** :
```
tp-todos-react/
├── user123/
│   ├── -todoId1: { title, createAt }
│   └── -todoId2: { title, createAt }
└── user456/
    └── ...
```

---

## Context API

### UserContext

Gestion de l'authentification.

```javascript
import { UserCtx } from '../contextes/user.context';
import { useContext } from 'react';

const { currentUser, signIn, signInWithEmail, logOut, isUserAdmin } = 
  useContext(UserCtx);
```

**Propriétés** :

| Nom | Type | Description |
|-----|------|-------------|
| `currentUser` | FirebaseUser \| null | Utilisateur actuellement connecté |
| `isUserAdmin` | boolean | Statut admin de l'utilisateur |

**Méthodes** :

| Nom | Signature | Description |
|-----|-----------|-------------|
| `signIn` | `() => Promise<void>` | Connexion Google |
| `signInWithEmail` | `(email: string, pass: string) => void` | Connexion email/password |
| `logOut` | `() => void` | Déconnexion |

---

### TodosContext

Gestion de la liste des tâches.

```javascript
import { TodosCtx } from '../contextes/todos.context';
import { useContext } from 'react';

const { todosList, addToFirebase } = useContext(TodosCtx);
```

**Propriétés** :

| Nom | Type | Description |
|-----|------|-------------|
| `todosList` | Todo[] | Liste des tâches de l'utilisateur |

**Méthodes** :

| Nom | Signature | Description |
|-----|-----------|-------------|
| `addToFirebase` | `(uid: string, title: string) => Promise<void>` | Ajouter une tâche |

**Type Todo** :
```typescript
interface Todo {
  id: string;
  title: string;
  createAt: string;
}
```

---

## Composants

### App

Composant racine.

```javascript
import App from './App';

// Utilisé dans main.jsx
<App />
```

**Props** : Aucun

**Rend** : Ensemble de l'application

---

### TodoForm

Formulaire d'ajout de tâche.

```javascript
import { TodoForm } from './components/TodoForm';

<TodoForm />
```

**Props** : Aucun

**État interne** :
- `todoTitle: string` - Titre en cours de saisie

**Fonctionnalités** :
- Input pour le titre
- Bouton "add"
- Sauvegarde en Firebase

---

### TodosList

Affichage de la liste des tâches.

```javascript
import { TodosList } from './components/TodosList';

<TodosList />
```

**Props** : Aucun

**Fonctionnalités** :
- Affiche toutes les tâches
- Bouton "x" pour suppression (non implémenté)
- Mise à jour automatique en temps réel

---

### UploadFile

Téléchargement de fichiers.

```javascript
import { UploadFile } from './components/UploadFile';

<UploadFile />
```

**Props** : Aucun

**Fonctionnalités** :
- Input de fichier
- Compression avec Compressor.js
- Upload vers Firebase Storage

---

## Types Firebase

### FirebaseUser

```typescript
interface FirebaseUser {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  metadata: {
    creationTime: string;
    lastSignInTime: string;
  };
  providerData: ProviderData[];
  getIdToken(): Promise<string>;
}
```

---

## Configuration

### firebaseConfig

Configuration de l'application Firebase.

```javascript
import { firebaseConfig } from '../services/firebase/firebase.config';

console.log(firebaseConfig.projectId);
```

**Propriétés** :
```javascript
{
  apiKey: string,
  authDomain: string,
  projectId: string,
  storageBucket: string,
  messagingSenderId: string,
  appId: string,
  databaseURL: string
}
```

**Source** : Variables d'environnement `.env`

---

## Hooks personnalisés recommandés

### useUser

```javascript
import { useContext } from 'react';
import { UserCtx } from '../contextes/user.context';

export function useUser() {
  return useContext(UserCtx);
}

// Utilisation
const { currentUser, signIn } = useUser();
```

### useTodos

```javascript
import { useContext } from 'react';
import { TodosCtx } from '../contextes/todos.context';

export function useTodos() {
  return useContext(TodosCtx);
}

// Utilisation
const { todosList, addToFirebase } = useTodos();
```

---

## Chaînes d'erreur Firebase

### Authentication

| Code | Message |
|------|---------|
| `auth/weak-password` | Mot de passe trop faible |
| `auth/email-already-in-use` | Email déjà utilisé |
| `auth/invalid-email` | Email invalide |
| `auth/wrong-password` | Mot de passe incorrect |
| `auth/user-not-found` | Utilisateur inexistant |
| `auth/popup-closed-by-user` | Popup fermée par l'utilisateur |
| `auth/popup-blocked` | Popup bloquée |
| `auth/network-request-failed` | Erreur réseau |

### Database

| Code | Message |
|------|---------|
| `auth/permission-denied` | Pas d'autorisation |
| `database/offline` | Hors ligne |

---

## Constantes

### Collection path

```javascript
'tp-todos-react'  // Collection principale
'userAdmin'       // Collection des admins
'files'           // Storage path
```

### Firestore rules

```
tp-todos-react / {uid} / {todoId}
```

---

**Besoin d'aide ?** Consultez la [FAQ](/docs/resources/faq) ou [Troubleshooting](/docs/resources/troubleshooting)

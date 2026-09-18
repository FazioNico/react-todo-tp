---
layout: ../../../layouts/DocsLayout.astro
title: Service Firebase
description: Intégration Firebase et fonctions utilitaires
---

## Vue d'ensemble

Le service Firebase encapsule toutes les interactions avec les APIs Firebase (Authentication, Realtime Database, Storage).

## Fichiers du service

### firebase.config.js

Configuration de l'application Firebase :

```javascript
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
};
```

### firebase.js

Initialisation et fonctions Firebase :

```javascript
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./firebase.config";
// ... imports des services Firebase

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Collection principale pour les tâches
export const collection = ref(database, 'tp-todos-react');
```

## Fonctions principales

### addToFirebase

Ajoute une nouvelle tâche à la base de données.

```javascript
/**
 * Function to save new Todo into Firebase Realtime Database
 * using UID (user ID) and todo title as params
 * @param {string} uid Unique User ID
 * @param {string} title Todo Title
 * @example
 * ```
 * const result = await addToFirebase('001', 'new Todo');
 * ```
 */
export const addToFirebase = async (uid, title) => {
  await push(child(collection, uid), {
    title,
    createAt: new Date().toISOString()
  });
}
```

**Utilisation** :
```javascript
const { addToFirebase } = useContext(TodosCtx);
await addToFirebase(currentUser.uid, "Faire les courses");
```

**Structure Firebase créée** :
```
tp-todos-react/
└── user123/
    └── -pushId123: {
          title: "Faire les courses",
          createAt: "2024-01-15T10:30:00Z"
        }
```

### signinWithGoogle

Authentification avec Google OAuth.

```javascript
export const signinWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}
```

**Retour** :
```javascript
{
  uid: "google-user-id",
  email: "user@gmail.com",
  displayName: "User Name",
  photoURL: "https://...",
  // ... autres propriétés
}
```

### signinWithEmailAndPass

Authentification par email/mot de passe.

```javascript
export const signinWithEmailAndPass = async (email, pass) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}
```

**Note** : Crée automatiquement un compte s'il n'existe pas.

### signinAsAnonymous

Connexion anonyme.

```javascript
export const signinAsAnonymous = async () => {
  await signInAnonymously(auth);
}
```

**Utilisé pour** : Connexion automatique au démarrage.

### isAdmin

Vérifie si un utilisateur est administrateur.

```javascript
export const isAdmin = async (userId) => {
  const collection = ref(database, 'userAdmin');
  const admin = await get(collection).then(snap => snap.val());
  return admin[userId] ? true : false;
}
```

**Structure** :
```
userAdmin/
├── user123: true   // admin
├── user456: false  // non-admin
└── user789: true   // admin
```

## Authentification

### Fournisseurs disponibles

#### Google OAuth
```javascript
const provider = new GoogleAuthProvider();
await signInWithPopup(auth, provider);
```

Nécessite de configurer les identifiants Google dans Firebase Console.

#### Email/Password
```javascript
await createUserWithEmailAndPassword(auth, email, password);
```

Crée automatiquement un compte.

#### Anonyme
```javascript
await signInAnonymously(auth);
```

Crée un compte temporaire sans identifiants.

### Surveillance de l'état

```javascript
import { onAuthStateChanged } from "firebase/auth";

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("Utilisateur connecté:", user.uid);
  } else {
    console.log("Utilisateur déconnecté");
  }
});
```

### Déconnexion

```javascript
import { signOut } from "firebase/auth";

await signOut(auth);
```

## Realtime Database

### Opérations CRUD

#### Create (Create/Push)

```javascript
import { push, child, ref } from "firebase/database";

const newTodoRef = await push(child(ref(database, 'tp-todos-react/uid'), {}), {
  title: "Nouvelle tâche",
  createAt: new Date().toISOString()
});
```

#### Read (Get)

```javascript
import { get, ref } from "firebase/database";

const snapshot = await get(ref(database, 'tp-todos-react/uid'));
const data = snapshot.val();
```

#### Read Real-time (Listen)

```javascript
import { onValue, child, ref } from "firebase/database";

onValue(child(ref(database, 'tp-todos-react/uid')), (snapshot) => {
  const data = snapshot.val();
  console.log("Données mises à jour:", data);
});
```

#### Update

```javascript
import { update, ref } from "firebase/database";

await update(ref(database, 'tp-todos-react/uid/todoId'), {
  title: "Titre mis à jour"
});
```

#### Delete

```javascript
import { remove, ref } from "firebase/database";

await remove(ref(database, 'tp-todos-react/uid/todoId'));
```

### Structure de données

```json
{
  "tp-todos-react": {
    "user123": {
      "-todoId1": {
        "title": "Faire les courses",
        "createAt": "2024-01-15T10:30:00Z"
      },
      "-todoId2": {
        "title": "Appeler le plombier",
        "createAt": "2024-01-16T14:20:00Z"
      }
    },
    "user456": {
      // ...
    }
  },
  "userAdmin": {
    "user123": true,
    "user456": false
  }
}
```

## Storage (Fichiers)

### Upload

```javascript
import { ref, uploadBytes } from "firebase/storage";

const fileRef = ref(storage, `files/${uid}/${fileName}`);
await uploadBytes(fileRef, file);
```

### Download

```javascript
import { ref, getBytes } from "firebase/storage";

const fileRef = ref(storage, `files/${uid}/${fileName}`);
const bytes = await getBytes(fileRef);
```

### Delete

```javascript
import { ref, deleteObject } from "firebase/storage";

const fileRef = ref(storage, `files/${uid}/${fileName}`);
await deleteObject(fileRef);
```

## Règles de sécurité

### Realtime Database

```json
{
  "rules": {
    "tp-todos-react": {
      "$uid": {
        ".read": "$uid === auth.uid",
        ".write": "$uid === auth.uid",
        ".indexOn": ["createAt"]
      }
    },
    "userAdmin": {
      ".read": true
    }
  }
}
```

### Storage

```json
{
  "rules": {
    "files/{userId}": {
      ".read": "request.auth.uid == userId",
      ".write": "request.auth.uid == userId"
    }
  }
}
```

## Gestion des erreurs

### Erreurs Firebase courantes

```javascript
try {
  await signinWithEmailAndPass(email, password);
} catch (error) {
  switch (error.code) {
    case 'auth/invalid-email':
      console.error('Email invalide');
      break;
    case 'auth/weak-password':
      console.error('Mot de passe trop faible');
      break;
    case 'auth/email-already-in-use':
      console.error('Email déjà utilisé');
      break;
    case 'auth/wrong-password':
      console.error('Mot de passe incorrect');
      break;
    default:
      console.error('Erreur:', error.message);
  }
}
```

## Performance

### Indexation

Pour optimiser les requêtes, ajoutez des index :

```json
{
  "rules": {
    "tp-todos-react": {
      "$uid": {
        ".indexOn": ["createAt"]  // Index sur createAt
      }
    }
  }
}
```

### Pagination

```javascript
import { query, limitToLast } from "firebase/database";

const recentTodos = await get(
  query(child(collection, uid), limitToLast(10))
);
```

## Points clés

- ✅ Encapsule toutes les interactions Firebase
- ✅ Gère l'authentification multi-fournisseur
- ✅ Synchronisation temps réel
- ✅ Stockage des fichiers
- ❌ Pas de gestion des erreurs au service level
- ❌ Pas de retry automatique

---

**Suivant ?** [→ Authentification](/docs/services/authentication)

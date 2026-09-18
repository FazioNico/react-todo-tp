---
layout: ../../layouts/DocsLayout.astro
title: Configuration
description: Guide de configuration de React Todo App
---

## Configuration de l'application

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyD...
VITE_FIREBASE_AUTH_DOMAIN=react-todo-tp.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=react-todo-tp
VITE_FIREBASE_STORAGE_BUCKET=react-todo-tp.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456
VITE_FIREBASE_DATABASE_URL=https://react-todo-tp-default-rtdb.europe-west1.firebaseio.com
```

### Configuration Vite

Le fichier `vite.config.js` configure le bundler :

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

## Configuration Firebase

### Authentification

#### Email/Password

Pour permettre l'authentification par email :

1. Allez dans **Firebase Console** → **Authentication** → **Sign-in method**
2. Activez **Email/Password**
3. Optionnel : Activez **Email link (passwordless sign-in)**

#### Google OAuth

1. Dans **Sign-in method**, activez **Google**
2. Sélectionnez votre projet dans la liste déroulante
3. Les domaines autorisés seront automatiquement configurés

#### Connexion anonyme

1. Activez **Anonymous** dans **Sign-in method**
2. Les utilisateurs anonymes peuvent se connecter sans identifiants

### Realtime Database

#### Règles de sécurité

Les règles par défaut pour le développement :

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

**⚠️ Important** : En production, assurez-vous que seuls les utilisateurs autorisés peuvent lire/écrire.

#### Structure de la base de données

```
tp-todos-react/
├── user123/
│   ├── -todo1: { title: "Faire les courses", createAt: "2024-01-01T..." }
│   ├── -todo2: { title: "Appeler le plombier", createAt: "2024-01-02T..." }
│   └── ...
├── user456/
│   └── ...
└── ...

userAdmin/
├── user123: true
├── user456: false
└── ...
```

### Storage

#### Règles de sécurité

```json
{
  "rules": {
    "files/{userId}/{filename}": {
      ".read": "request.auth.uid == userId",
      ".write": "request.auth.uid == userId"
    }
  }
}
```

## Configuration des contextes

### UserContext

Gère l'authentification et l'état utilisateur :

```javascript
export const UserProvider = ({ children }) => {
  // Connecte automatiquement un utilisateur anonyme au démarrage
  // Offre les méthodes : signIn, signInWithEmail, logOut
  // Expose : currentUser, isUserAdmin
}
```

### TodosContext

Gère la liste des tâches :

```javascript
export const TodosProvider = ({ children }) => {
  // Écoute les modifications en temps réel de Firebase
  // Expose : todosList, addToFirebase
}
```

## Configuration de développement

### Scripts disponibles

```bash
npm run dev      # Démarrer le serveur de développement
npm run build    # Construire pour la production
npm run preview  # Prévisualiser la build
npm run lint     # Lancer oxlint
```

### Hot Module Replacement (HMR)

Vite inclut HMR par défaut. Les modifications de code sont automatiquement rechargées dans le navigateur.

### Mode strict React

React fonctionne en mode strict en développement pour vous aider à détecter les bugs potentiels.

## Configuration de production

### Build

```bash
npm run build
```

Cela crée un dossier `dist` optimisé pour la production.

### Déploiement

#### Sur Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy --only hosting
```

#### Sur Vercel

```bash
npm install -g vercel
vercel
```

#### Sur Netlify

1. Connectez votre repository GitHub à Netlify
2. Définissez la commande de build : `npm run build`
3. Définissez le répertoire de publication : `dist`

## Optimisations

### Compression des fichiers

L'application utilise **Compressor.js** pour compresser les images avant upload :

```javascript
import Compressor from 'compressorjs';

new Compressor(file, {
  quality: 0.6,
  success(result) {
    // Fichier compressé
  },
});
```

### Code splitting

Vite divise automatiquement le code en chunks pour optimiser le chargement initial.

### Lazy loading

Vous pouvez implémenter le lazy loading pour les composants :

```javascript
const TodosList = React.lazy(() => import('./components/TodosList'));
```

---

**Suivant ?** [→ Architecture du projet](/docs/architecture/overview)

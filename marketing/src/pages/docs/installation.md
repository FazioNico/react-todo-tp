---
layout: ../../layouts/DocsLayout.astro
title: Installation
description: Guide d'installation de React Todo App
---

## Installation du projet

### 1. Cloner le repository

```bash
git clone https://github.com/nomades/react-todo-tp.git
cd react-todo-tp
```

### 2. Installer les dépendances

```bash
npm install
```

Cela installera toutes les dépendances nécessaires :
- React 19
- Vite
- Firebase
- Compressor.js

### 3. Vérifier l'installation

Assurez-vous que tout s'est bien installé :

```bash
npm --version
node --version
```

Vous devriez avoir :
- Node.js 18+
- npm 9+

## Configuration de Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com)
2. Cliquez sur "Créer un projet"
3. Nommez votre projet (par exemple "React Todo")
4. Acceptez les conditions et cliquez "Créer"

### 2. Créer une application web

1. Dans le tableau de bord, cliquez sur "Créer une application"
2. Sélectionnez l'icône Web
3. Enregistrez votre application
4. Copiez les paramètres de configuration

### 3. Activer les services Firebase

#### Authentication

1. Allez dans **Authentication** → **Sign-in method**
2. Activez :
   - **Email/Password**
   - **Google**
   - **Anonymous**

#### Realtime Database

1. Allez dans **Realtime Database**
2. Créez une base de données en mode Test (pour développement)
3. Choisissez la région : `us-central1`

#### Storage

1. Allez dans **Storage**
2. Créez un bucket

### 4. Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
# Firebase Config
VITE_FIREBASE_API_KEY=<votre_api_key>
VITE_FIREBASE_AUTH_DOMAIN=<votre_auth_domain>
VITE_FIREBASE_PROJECT_ID=<votre_project_id>
VITE_FIREBASE_STORAGE_BUCKET=<votre_storage_bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<votre_sender_id>
VITE_FIREBASE_APP_ID=<votre_app_id>
VITE_FIREBASE_DATABASE_URL=<votre_database_url>
```

### 5. Mettre à jour la configuration Firebase

Modifiez `src/services/firebase/firebase.config.js` :

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

## Lancer l'application

### Mode développement

```bash
npm run dev
```

L'application sera disponible à `http://localhost:5173`

### Mode production

```bash
npm run build
npm run preview
```

## Vérifier l'installation

1. Ouvrez `http://localhost:5173` dans votre navigateur
2. Vous devriez voir la page d'accueil avec les boutons d'authentification
3. Essayez de vous connecter avec Google ou un email/password

Si vous voyez une erreur d'authentification Firebase :
- Vérifiez que les variables d'environnement sont correctement définies
- Vérifiez que les services Firebase sont activés
- Vérifiez les règles de sécurité Firestore/Realtime Database

## Dépannage

### "Firebase: Error (auth/invalid-api-key)"

**Solution** : Vérifiez que votre `VITE_FIREBASE_API_KEY` est correct et que les services Google Cloud sont activés pour votre projet.

### "The specified Database URL is invalid"

**Solution** : Assurez-vous que `VITE_FIREBASE_DATABASE_URL` est configuré et que Realtime Database est activée.

### Les modifications ne se sauvegardent pas

**Solution** : Vérifiez que vous êtes connecté et que les règles de sécurité Realtime Database permettent les écritures.

---

**Prêt ?** [→ Allez à Configuration](/docs/configuration)

---
layout: ../../../layouts/DocsLayout.astro
title: Authentification
description: Système d'authentification multi-fournisseur
---

## Vue d'ensemble

React Todo App supporte trois méthodes d'authentification :

1. **Google OAuth** - Connexion avec un compte Google
2. **Email/Password** - Création de compte et connexion
3. **Anonyme** - Connexion automatique sans identifiants

## Flux d'authentification

```
Démarrage de l'app
  ↓
UserProvider initialise
  ↓
signinAsAnonymous() - Connexion automatique
  ↓
onAuthStateChanged() - Écoute les changements
  ↓
currentUser défini
  ↓
Contexte mis à jour
  ↓
Composants re-render avec l'utilisateur
```

## Configuration

### Google OAuth

**1. Configuration Firebase Console**

- Allez dans **Authentication** → **Sign-in method**
- Activez **Google**
- Sélectionnez votre projet Google Cloud

**2. Configuration des URI de redirection**

Firebase configure automatiquement :
- `https://[projet].firebaseapp.com/__/auth/handler`
- `http://localhost:5173` (développement)

**3. Utilisation dans le code**

```javascript
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export const signinWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user;
}
```

### Email/Password

**1. Configuration Firebase Console**

- Allez dans **Authentication** → **Sign-in method**
- Activez **Email/Password**
- Optionnel : Activez **Email link (passwordless sign-in)**

**2. Utilisation dans le code**

```javascript
import { createUserWithEmailAndPassword } from "firebase/auth";

export const signinWithEmailAndPass = async (email, pass) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
  return userCredential.user;
}
```

### Connexion anonyme

**1. Configuration Firebase Console**

- Allez dans **Authentication** → **Sign-in method**
- Activez **Anonymous**

**2. Utilisation dans le code**

```javascript
import { signInAnonymously } from "firebase/auth";

export const signinAsAnonymous = async () => {
  await signInAnonymously(auth);
}
```

## État utilisateur

### Propriétés disponibles

```javascript
{
  uid: string,                 // ID unique
  email: string,              // Email (peut être undefined)
  displayName: string,        // Nom d'affichage (Google)
  photoURL: string,           // Photo de profil (Google)
  emailVerified: boolean,     // Email vérifié
  phoneNumber: string,        // Téléphone (optionnel)
  isAnonymous: boolean,       // Connexion anonyme
  metadata: {
    creationTime: string,     // Date de création
    lastSignInTime: string    // Dernière connexion
  },
  providerData: Array,        // Fournisseurs liés
  // ... autres propriétés
}
```

### Exemple d'accès

```javascript
const { currentUser } = useContext(UserCtx);

if (!currentUser) {
  return <p>Non connecté</p>;
}

console.log(currentUser.uid);      // ID unique
console.log(currentUser.email);    // Email
console.log(currentUser.isAnonymous); // Anonyme?
```

## Flux de connexion détaillé

### Google OAuth

```
1. Utilisateur clique "Connexion Google"
  ↓
2. signIn() appelé
  ↓
3. signinWithGoogle() exécuté
  ↓
4. Popup Google s'ouvre
  ↓
5. Utilisateur se connecte à Google
  ↓
6. Google retourne les identifiants
  ↓
7. Firebase valide
  ↓
8. onAuthStateChanged déclenché
  ↓
9. currentUser mis à jour
  ↓
10. Composants re-render
  ↓
11. Affichage de l'email et du bouton logout
```

### Email/Password

```
1. Utilisateur entre email et password
  ↓
2. signInWithEmail(email, pass) appelé
  ↓
3. signinWithEmailAndPass() exécuté
  ↓
4. Firebase valide les identifiants
  ↓
5. Créé le compte s'il n'existe pas
  ↓
6. onAuthStateChanged déclenché
  ↓
7. currentUser mis à jour
  ↓
8. Utilisateur connecté
```

## Vérification de l'authentification

### Avant d'effectuer une action

```javascript
const handleAddTodo = () => {
  if (!currentUser?.uid) {
    alert('Veuillez vous connecter');
    return;
  }
  // Action autorisée
  addToFirebase(currentUser.uid, title);
}
```

### Optional chaining

```javascript
// Sûr - retourne undefined si currentUser est null
currentUser?.uid
currentUser?.email
currentUser?.isAnonymous

// Pas sûr - lance une erreur si currentUser est null
currentUser.uid     // ERREUR si null
```

## Statut admin

La vérification du statut admin se fait via la base de données :

```javascript
// Dans UserContext
const result = await isAdmin(user.uid);
setIsUserAdmin(result);
```

Structure de la base de données :

```json
{
  "userAdmin": {
    "user123": true,   // admin
    "user456": false,  // non-admin
    "user789": true    // admin
  }
}
```

## Déconnexion

```javascript
import { signOut } from "firebase/auth";

export const logOut = async () => {
  await signOut(auth);
  // onAuthStateChanged déclenchera automatiquement
  // currentUser sera undefined
  // Les composants re-rendront
}
```

## Gestion des erreurs

### Erreurs d'authentification

```javascript
try {
  await signinWithGoogle();
} catch (error) {
  switch (error.code) {
    case 'auth/popup-closed-by-user':
      console.error('Popup fermée par l\'utilisateur');
      break;
    case 'auth/popup-blocked':
      console.error('Popup bloquée par le navigateur');
      break;
    case 'auth/network-request-failed':
      console.error('Erreur réseau');
      break;
    default:
      console.error('Erreur:', error.message);
  }
}
```

### Erreurs Email/Password

```javascript
try {
  await signinWithEmailAndPass(email, password);
} catch (error) {
  switch (error.code) {
    case 'auth/weak-password':
      return 'Mot de passe trop faible (min 6 caractères)';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé';
    case 'auth/invalid-email':
      return 'Email invalide';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect';
    default:
      return error.message;
  }
}
```

## Sécurité

### ✅ Bonnes pratiques

1. **Vérifier l'authentification avant les opérations sensibles**
   ```javascript
   if (!currentUser?.uid) return; // Protection
   ```

2. **Utiliser les règles Firebase**
   ```json
   {
     "rules": {
       "tp-todos-react": {
         "$uid": {
           ".read": "$uid === auth.uid"
         }
       }
     }
   }
   ```

3. **Protéger les routes admin**
   ```javascript
   if (!isUserAdmin) {
     return <p>Accès refusé</p>;
   }
   ```

### ❌ À éviter

1. **Stocker les tokens côté client**
   ```javascript
   // MAUVAIS - Firebase gère les tokens automatiquement
   localStorage.setItem('token', token);
   ```

2. **Faire confiance au frontend pour la sécurité**
   ```javascript
   // Les règles Firebase sont essentielles
   ```

3. **Exposer les clés API**
   ```env
   # Bien - utiliser les variables d'environnement
   VITE_FIREBASE_API_KEY=...
   ```

## Migration d'un compte anonyme

Quand un utilisateur anonyme se connecte avec un compte réel :

```javascript
// Avant migration
currentUser.isAnonymous === true

// Après connexion
await signinWithGoogle()

// onAuthStateChanged déclenche
// currentUser reçoit le nouvel utilisateur
// Les données anonymes ne sont pas transférées
```

**Note** : Firebase ne fusionne pas automatiquement les comptes. Vous devez implémenter la migration manuellement si nécessaire.

## Points clés

- ✅ Authentification multi-fournisseur
- ✅ Connexion automatique anonyme
- ✅ Gestion d'état centralisée
- ✅ Vérification admin
- ❌ Pas de migration automatique de compte anonyme
- ❌ Pas de vérification d'email

---

**Suivant ?** [→ Contexte utilisateur](/docs/contexts/user-context)

---
layout: ../../../layouts/DocsLayout.astro
title: UserContext
description: Gestion de l'authentification et profil utilisateur
---

## Vue d'ensemble

`UserContext` gère l'état d'authentification de l'application. Il fournit l'utilisateur actuellement connecté, les méthodes de connexion/déconnexion, et le statut admin.

## Utilisation

### Récupérer le contexte

```javascript
import { useContext } from 'react';
import { UserCtx } from '../contextes/user.context';

function MyComponent() {
  const { currentUser, signIn, logOut, signInWithEmail, isUserAdmin } = 
    useContext(UserCtx);
  
  // ...
}
```

## API

### `currentUser`

L'objet utilisateur actuellement connecté.

**Type** :
```javascript
{
  uid: string,
  email: string | undefined,
  displayName: string | undefined,
  photoURL: string | undefined,
  isAnonymous: boolean,
  emailVerified: boolean,
  // ... autres propriétés Firebase
} | null
```

**Exemple** :
```javascript
if (!currentUser) {
  return <p>Non connecté</p>;
}

console.log(currentUser.email);  // "user@gmail.com"
console.log(currentUser.uid);    // "abc123def456"
```

### `signIn()`

Connexion avec Google OAuth.

**Signature** :
```javascript
async function signIn(): Promise<void>
```

**Exemple** :
```javascript
<button onClick={signIn}>Se connecter avec Google</button>
```

**Erreurs possibles** :
- `auth/popup-closed-by-user` - Popup fermée
- `auth/popup-blocked` - Popup bloquée
- `auth/network-request-failed` - Erreur réseau

### `signInWithEmail(email, password)`

Connexion/inscription avec email et mot de passe.

**Signature** :
```javascript
async function signInWithEmail(
  email: string,
  password: string
): Promise<void>
```

**Exemple** :
```javascript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

<input 
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  placeholder="Email"
/>
<input 
  type="password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  placeholder="Mot de passe"
/>
<button onClick={() => signInWithEmail(email, password)}>
  Se connecter
</button>
```

**Erreurs possibles** :
- `auth/weak-password` - Mot de passe trop faible
- `auth/email-already-in-use` - Email existe déjà
- `auth/invalid-email` - Email invalide
- `auth/wrong-password` - Mot de passe incorrect
- `auth/user-not-found` - Utilisateur inexistant

### `logOut()`

Déconnexion de l'utilisateur.

**Signature** :
```javascript
async function logOut(): Promise<void>
```

**Exemple** :
```javascript
<button onClick={logOut}>Déconnexion</button>
```

**Effet** : 
- Déconnecte l'utilisateur
- `currentUser` devient `null`
- Déclenche une reconnexion anonyme

### `isUserAdmin`

Booléen indiquant si l'utilisateur est administrateur.

**Type** : `boolean`

**Exemple** :
```javascript
{isUserAdmin && <button>Tableau d'administration</button>}
```

## Cycle de vie

### Initialisation

```javascript
useEffect(() => {
  // 1. Connexion anonyme automatique
  signinAsAnonymous();
  
  // 2. Écoute les changements d'authentification
  onAuthStateChanged(auth, async (user) => {
    // 3. Met à jour currentUser
    setCurrentUser(user || null);
    
    // 4. Vérification du statut admin
    if (user) {
      const isAdmin = await isAdmin(user.uid);
      setIsUserAdmin(isAdmin);
    }
  });
}, []); // Exécuté une seule fois au montage
```

## Exemples d'utilisation

### Afficher l'état de connexion

```javascript
function UserStatus() {
  const { currentUser } = useContext(UserCtx);
  
  return (
    <div>
      {currentUser?.isAnonymous ? (
        <p>Connecté anonymement</p>
      ) : currentUser ? (
        <p>Connecté : {currentUser.email}</p>
      ) : (
        <p>Non connecté</p>
      )}
    </div>
  );
}
```

### Protéger une fonctionnalité

```javascript
function AddTodoButton() {
  const { currentUser } = useContext(UserCtx);
  const { addToFirebase } = useContext(TodosCtx);
  
  const handleAdd = () => {
    if (!currentUser?.uid) {
      alert('Veuillez vous connecter');
      return;
    }
    addToFirebase(currentUser.uid, 'Nouvelle tâche');
  };
  
  return <button onClick={handleAdd}>Ajouter une tâche</button>;
}
```

### Afficher un menu admin

```javascript
function AdminMenu() {
  const { isUserAdmin } = useContext(UserCtx);
  
  if (!isUserAdmin) {
    return null;
  }
  
  return (
    <div className="admin-menu">
      <h3>Administration</h3>
      <button>Gérer les utilisateurs</button>
      <button>Statistiques</button>
      <button>Paramètres</button>
    </div>
  );
}
```

### Formulaire d'authentification complet

```javascript
function AuthForm() {
  const { currentUser, signIn, signInWithEmail, logOut } = 
    useContext(UserCtx);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  
  const handleEmailSignIn = async () => {
    try {
      setError(null);
      await signInWithEmail(email, password);
    } catch (err) {
      setError(err.message);
    }
  };
  
  if (currentUser) {
    return (
      <div>
        <p>Connecté : {currentUser.email}</p>
        <button onClick={logOut}>Déconnexion</button>
      </div>
    );
  }
  
  return (
    <div>
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mot de passe"
      />
      <button onClick={handleEmailSignIn}>Se connecter par email</button>
      <button onClick={signIn}>Se connecter avec Google</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
```

## Bonnes pratiques

### ✅ À faire

```javascript
// Vérifier avant d'utiliser
if (!currentUser?.uid) {
  return;
}

// Utiliser l'optional chaining
const email = currentUser?.email;

// Vérifier le statut anonyme
if (currentUser?.isAnonymous) {
  showSignUpPrompt();
}
```

### ❌ À éviter

```javascript
// Sans vérification
const uid = currentUser.uid; // ERREUR si null

// Pas de optional chaining
const email = currentUser.email; // ERREUR si null

// Dupliquer l'état
const [user, setUser] = useState(currentUser);
// Se désynchronise rapidement
```

## Limitations actuelles

- ❌ Pas de réinitialisation de mot de passe
- ❌ Pas de vérification d'email
- ❌ Pas de lien entre comptes
- ❌ Pas de suppression de compte
- ❌ Pas de modification de profil

## Améliorations suggérées

### 1. Ajouter la réinitialisation de mot de passe

```javascript
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email);
}
```

### 2. Ajouter la modification de profil

```javascript
export const updateProfile = async (updates) => {
  await updateUserProfile(auth.currentUser, updates);
}
```

### 3. Ajouter la vérification d'email

```javascript
export const sendEmailVerification = async () => {
  await sendEmailVerification(auth.currentUser);
}
```

### 4. Créer un hook personnalisé

```javascript
export function useUser() {
  return useContext(UserCtx);
}

// Utilisation
const { currentUser, signIn } = useUser();
```

---

**Suivant ?** [→ TodosContext](/docs/contexts/todos-context)

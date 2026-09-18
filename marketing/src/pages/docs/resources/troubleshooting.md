---
layout: ../../../layouts/DocsLayout.astro
title: Troubleshooting
description: Dépannage des problèmes courants
---

## Problèmes de démarrage

### "Module not found" ou erreur d'import

**Symptômes** : Erreur lors du `npm install` ou au démarrage du serveur

**Solutions** :
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

**Si ça ne fonctionne pas** :
- Vérifiez que vous utilisez Node 18+
- Essayez npm 9+ : `npm install -g npm@latest`

### Le port 5173 est déjà utilisé

**Symptômes** : "EADDRINUSE: address already in use :::5173"

**Solutions** :
```bash
# Utiliser un port différent
npm run dev -- --port 3000

# Ou arrêter le processus utilisant le port
# macOS/Linux
lsof -i :5173
kill -9 <PID>

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### "Cannot find module" pour Firebase

**Symptômes** : Erreur lors de l'import de firebase

**Solutions** :
```bash
# Réinstaller Firebase
npm install firebase

# Ou nettoyer le cache npm
npm cache clean --force
npm install
```

---

## Problèmes d'authentification

### "Firebase API key error" ou erreur de configuration

**Symptômes** : "Error: Your API key is not valid, please check you configuration"

**Causes** :
- Clé API invalide
- Services Firebase désactivés
- Domaine non autorisé

**Solutions** :
1. Vérifiez les variables d'environnement dans `.env`
2. Allez dans Firebase Console → **Paramètres du projet** → **Clés API**
3. Vérifiez que la clé API n'est pas restreinte
4. Ajoutez votre domaine local à la liste blanche :
   - Firebase Console → **Authentication** → **Settings**
   - Ajoutez `localhost:5173` aux domaines autorisés

### Popup Google ne s'ouvre pas

**Symptômes** : Clic sur "Google Sign In" ne fait rien

**Causes** :
- Popup bloquée par le navigateur
- Service Google non configuré
- CORS bloqué

**Solutions** :
```javascript
// Permettre la popup dans le navigateur
// Désactiver les bloqueurs de popup pour localhost

// Vérifier la configuration Firebase
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });
```

### "The specified Database URL is invalid"

**Symptômes** : Erreur Firebase Realtime Database

**Causes** :
- `VITE_FIREBASE_DATABASE_URL` manquant
- URL invalide

**Solutions** :
1. Allez dans Firebase Console → **Realtime Database**
2. Copiez l'URL en haut de la page (ex: `https://PROJECT.firebaseio.com`)
3. Ajoutez-la à `.env` : `VITE_FIREBASE_DATABASE_URL=https://...`
4. Redémarrez le serveur

### "Anonymous Sign-In is disabled"

**Symptômes** : Erreur au démarrage

**Solutions** :
- Firebase Console → **Authentication** → **Sign-in method**
- Activez **Anonymous**

---

## Problèmes de données

### Les tâches ne s'ajoutent pas

**Causes** :
- Utilisateur non connecté
- Règles Firebase trop restrictives
- Erreur réseau

**Solutions** :

**1. Vérifier la connexion utilisateur**
```javascript
// Dans App.jsx, ajoutez un console.log
console.log('Current user:', currentUser);
```

**2. Vérifier les règles Realtime Database**

Firebase Console → **Realtime Database** → **Rules**
```json
{
  "rules": {
    "tp-todos-react": {
      "$uid": {
        ".write": "$uid === auth.uid"  // Autorise l'écriture
      }
    }
  }
}
```

**3. Vérifier la console du navigateur**
- Ouvrez DevTools (F12)
- Allez dans **Console**
- Cherchez les erreurs Firebase

### Les tâches ne se chargent pas

**Causes** :
- Utilisateur n'a pas de tâches
- Erreur réseau
- La base de données n'existe pas

**Solutions** :

**1. Vérifier que la base existe**
- Firebase Console → **Realtime Database**
- Devrait voir `/tp-todos-react/`

**2. Vérifier les règles de lecture**
```json
{
  "rules": {
    "tp-todos-react": {
      "$uid": {
        ".read": "$uid === auth.uid"  // Autorise la lecture
      }
    }
  }
}
```

**3. Ajouter une tâche**
- Vous devriez voir au moins une tâche après
- Si non, l'ajout est bloqué

### "No user found" quand j'ajoute une tâche

**Causes** :
- `currentUser` est null
- `currentUser.uid` est undefined

**Solutions** :
```javascript
// Ajouter une vérification
if (!currentUser?.uid) {
  console.warn('No user logged in');
  return;
}
```

---

## Problèmes d'upload

### "Upload fails silently"

**Causes** :
- Storage pas activé
- Règles Storage trop restrictives
- Fichier trop volumineux

**Solutions** :

**1. Activer Storage**
- Firebase Console → **Storage**
- Créez un bucket

**2. Vérifier les règles Storage**
```json
{
  "rules": {
    "files/{userId}": {
      ".write": "request.auth.uid == userId"
    }
  }
}
```

**3. Vérifier la taille du fichier**
- Maximum 5 GB par défaut
- Compressor.js devrait réduire la taille

### "Compressor.js ne fonctionne pas"

**Symptômes** : Erreur lors de la compression d'image

**Solutions** :
```javascript
// Vérifier que Compressor est importé
import Compressor from 'compressorjs';

// Ajouter un console.log
new Compressor(file, {
  quality: 0.6,
  success(result) {
    console.log('Compressed:', result);
  },
  error(err) {
    console.error('Compression error:', err);
  }
});
```

---

## Problèmes de performance

### L'app est lente

**Causes** :
- Re-rendus inutiles
- Trop d'écouteurs Firebase
- Connexion réseau lente

**Solutions** :

**1. Vérifier les re-rendus**
```javascript
// Installer React DevTools
// Profiler → Enregistrer
// Voir les composants qui re-rendent
```

**2. Ajouter des index Firebase**
```json
{
  "rules": {
    "tp-todos-react": {
      "$uid": {
        ".indexOn": ["createAt"]
      }
    }
  }
}
```

**3. Mémoriser les composants**
```javascript
export const TodosList = React.memo(TodosListComponent);
```

### Les mises à jour en temps réel sont lentes

**Causes** :
- Connexion lente
- Trop d'écouteurs

**Solutions** :
- Vérifier la connexion (inspecteur réseau)
- Limiter le nombre d'écouteurs
- Implémenter la pagination

---

## Problèmes de sécurité

### "Cannot read properties of undefined"

**Causes** :
- Accès à une propriété sans vérification null

**Solutions** :
```javascript
// Utiliser l'optional chaining
currentUser?.uid    // Retourne undefined si null
currentUser.uid      // ERREUR si null

// Ou vérifier avant
if (currentUser) {
  console.log(currentUser.uid);
}
```

### Les données d'autres utilisateurs sont visibles

**Causes** :
- Règles Firebase trop permissives

**Solutions** :
```json
{
  "rules": {
    "tp-todos-react": {
      "$uid": {
        ".read": "$uid === auth.uid"   // Lire seulement ses propres données
      }
    }
  }
}
```

---

## Problèmes de déploiement

### "Process exited with code 1" sur Vercel/Netlify

**Solutions** :
1. Vérifiez que `.env` est configuré dans le dashboard
2. Vérifiez les variables avec un préfixe `VITE_`
3. Vérifiez que le build réussit localement

### "Functions are not available"

**Solutions** :
- Ce projet n'utilise pas Firebase Functions
- Ignorez cette erreur si elle apparaît

### Les variables d'environnement ne sont pas définies en production

**Solutions** :
1. Allez dans les paramètres du déploiement
2. Ajoutez toutes les variables `VITE_*`
3. Redéployez

---

## Débogage

### Activer les logs Firebase

```javascript
// Dans firebase.js
import { enableLogging } from 'firebase/database';
enableLogging(true);
```

### Utiliser React DevTools

```javascript
// Dans main.jsx
if (process.env.NODE_ENV === 'development') {
  import('react-devtools');
}
```

### Vérifier les erreurs dans la console

**Chrome DevTools** :
1. Appuyez sur F12
2. Allez dans **Console**
3. Cherchez les erreurs rouges

### Vérifier l'onglet Network

1. F12 → **Network**
2. Actualisez la page
3. Cherchez les requêtes en rouge (404, 500)

---

## Besoin d'aide ?

Si vous n'avez pas trouvé la solution :

1. Consultez la [FAQ](/docs/resources/faq)
2. Vérifiez la [documentation Firebase](https://firebase.google.com/docs)
3. Recherchez sur [Stack Overflow](https://stackoverflow.com)
4. Ouvrez une [issue GitHub](https://github.com)

---

**Retour à** → [FAQ](/docs/resources/faq)

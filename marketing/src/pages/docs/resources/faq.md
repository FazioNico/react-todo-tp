---
layout: ../../../layouts/DocsLayout.astro
title: FAQ - Questions Fréquentes
description: Réponses aux questions les plus fréquemment posées
---

## Questions générales

### Q: Qu'est-ce que React Todo App ?
A: React Todo App est une application web moderne de gestion de tâches construite avec React 19, Vite, et Firebase. Elle démontre les meilleures pratiques React avec une architecture propre et maintainable.

### Q: Puis-je utiliser ce projet comme point de départ ?
A: Oui ! Ce projet est conçu pour être extensible. Vous pouvez ajouter des fonctionnalités, modifier le design, ou utiliser l'architecture comme base pour vos propres projets.

### Q: Quel navigateur est supporté ?
A: Tout navigateur moderne supportant ES6 :
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Q: Comment installer le projet localement ?
A: Voir la section [Installation](/docs/installation).

---

## Configuration Firebase

### Q: Pourquoi dois-je créer un compte Firebase ?
A: Firebase fournit :
- Authentification
- Base de données temps réel
- Stockage de fichiers

C'est gratuit jusqu'à une certaine limite.

### Q: Puis-je utiliser une autre base de données ?
A: Oui, vous devriez modifier `src/services/firebase.js` pour utiliser votre base de données préférée (MongoDB, PostgreSQL, etc.).

### Q: Comment obtenir les paramètres Firebase ?
A: 
1. Créez un projet sur [Firebase Console](https://console.firebase.google.com)
2. Allez dans **Paramètres du projet**
3. Copiez les informations dans `.env`

### Q: Mes variables d'environnement ne sont pas reconnues ?
A: 
- Assurez-vous qu'elles commencent par `VITE_`
- Redémarrez le serveur de développement après modification
- Vérifiez que `.env` est au bon endroit

---

## Authentification

### Q: Pourquoi suis-je connecté anonyme au démarrage ?
A: C'est intentionnel. Cela permet aux utilisateurs :
- D'accéder à l'app sans créer un compte
- De voir les fonctionnalités avant de se connecter
- De créer des tâches temporaires

### Q: Comment changer mon mot de passe ?
A: Actuellement, cette fonctionnalité n'existe pas. Vous devez la implémenter avec :
```javascript
import { updatePassword } from "firebase/auth";
await updatePassword(auth.currentUser, newPassword);
```

### Q: Puis-je lier plusieurs comptes ?
A: Firebase supporte le linking de comptes, mais ce n'est pas implémenté. Vous pouvez utiliser :
```javascript
import { linkWithPopup } from "firebase/auth";
```

### Q: Qu'arrive-t-il à mes données si je me déconnecte ?
A: 
- **Utilisateur anonyme** : Les données sont perdues
- **Utilisateur authentifié** : Les données sont sauvegardées dans Firebase

### Q: Comment réinitialiser mon mot de passe ?
A: Implémentez la fonction :
```javascript
import { sendPasswordResetEmail } from "firebase/auth";
await sendPasswordResetEmail(auth, email);
```

---

## Tâches et données

### Q: Où sont stockées mes tâches ?
A: Dans Firebase Realtime Database sous `/tp-todos-react/{uid}/`.

### Q: Mes tâches sont-elles synchronisées en temps réel ?
A: Oui ! Le contexte `TodosContext` écoute les changements avec `onValue`.

### Q: Puis-je exporter mes tâches ?
A: Vous pouvez exporter en JSON :
```javascript
const json = JSON.stringify(todosList);
const blob = new Blob([json], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// Créer un lien de téléchargement
```

### Q: Puis-je supprimer une tâche ?
A: Actuellement, le bouton de suppression n'est pas implémenté. Vous devez ajouter :
```javascript
export const deleteTodo = async (uid, todoId) => {
  const todoRef = child(collection, `${uid}/${todoId}`);
  await remove(todoRef);
}
```

### Q: Puis-je marquer une tâche comme terminée ?
A: Pas par défaut. Vous devez ajouter une propriété `completed` et l'UI pour basculer.

---

## Upload de fichiers

### Q: Quels fichiers puis-je télécharger ?
A: Actuellement, seules les images sont compressées. Vous pouvez modifier les paramètres de `Compressor.js`.

### Q: Quelle est la limite de taille ?
A: Firebase Storage par défaut : 5 Go par fichier (ajustable).

### Q: Mes fichiers sont-ils compressés ?
A: Oui, automatiquement avec `Compressor.js` à 60% de qualité.

### Q: Puis-je télécharger des PDFs ?
A: Oui, modifiez le type MIME dans l'input :
```javascript
<input type="file" accept=".pdf" />
```

---

## Performance

### Q: Pourquoi l'app est-elle lente ?
A: Vérifiez :
- La connexion réseau (Firebase)
- Que les indices sont bien configurés
- La taille du localStorage
- Les React DevTools pour les re-rendus inutiles

### Q: Comment optimiser les performances ?
A:
1. Ajouter des indices Firebase
2. Utiliser `React.memo` pour les composants coûteux
3. Implémenter la pagination
4. Ajouter du lazy loading

### Q: Puis-je compresser davantage les images ?
A: Oui, modifiez les options de `Compressor.js` :
```javascript
{
  quality: 0.4,  // Au lieu de 0.6
  maxWidth: 800  // Au lieu de 1920
}
```

---

## Déploiement

### Q: Comment déployer en production ?
A: Options populaires :
- **Firebase Hosting** : Facile avec Firebase CLI
- **Vercel** : Connectez GitHub, déploiement auto
- **Netlify** : Similaire à Vercel
- **AWS Amplify** : Pour les projets plus complexes

### Q: Les variables d'environnement sont-elles sécurisées ?
A: 
- Les variables `VITE_` sont incluses dans le bundle
- Ne mettez jamais de secrets/tokens sensibles
- Les clés API Firebase sont publiques (elles utilisent les règles)

### Q: Comment configurer HTTPS ?
A: La plupart des hébergeurs (Vercel, Netlify) le font automatiquement.

---

## Dépannage

### Q: L'authentification ne fonctionne pas
A: Vérifiez :
- [ ] Les services d'auth sont activés dans Firebase
- [ ] Les variables d'environnement sont correctes
- [ ] Les domaines autorisés incluent votre URL
- [ ] La console affiche une erreur spécifique

### Q: Impossible d'ajouter des tâches
A: Vérifiez :
- [ ] Vous êtes connecté (currentUser != null)
- [ ] Les règles Firebase permettent les écritures
- [ ] La base de données existe et est active

### Q: Les fichiers ne s'upload pas
A: Vérifiez :
- [ ] Storage est activé dans Firebase
- [ ] Les règles Storage permettent les uploads
- [ ] Le fichier n'est pas trop gros
- [ ] La taille de compression est raisonnable

### Q: Le serveur de développement ne démarre pas
A: Essayez :
```bash
npm install  # Réinstaller les dépendances
npm run dev  # Redémarrer
```

---

## Contribution

### Q: Comment contribuer ?
A: 
1. Fork le repository
2. Créez une branche (`git checkout -b feature/amazing`)
3. Commitez vos changements
4. Poussez la branche
5. Ouvrez une Pull Request

### Q: Quel style de code utilisez-vous ?
A: 
- ESLint avec oxlint
- Nommage camelCase pour les variables
- PascalCase pour les composants
- Code sans commentaires (sauf cas complexe)

### Q: Où signaler des bugs ?
A: Ouvrez une issue sur [GitHub](https://github.com) avec :
- Description du bug
- Étapes pour reproduire
- Résultat attendu
- Résultat réel

---

## Ressources

### Liens utiles

- [Documentation Firebase](https://firebase.google.com/docs)
- [Documentation React](https://react.dev)
- [Documentation Vite](https://vitejs.dev)
- [Compressor.js](https://fengyuanchen.github.io/compressorjs/)

### Communautés

- [Discord React](https://discord.gg/react)
- [Stack Overflow - React](https://stackoverflow.com/questions/tagged/reactjs)
- [Dev.to](https://dev.to)

---

Vous n'avez pas trouvé la réponse ? Consultez [Troubleshooting](/docs/resources/troubleshooting) ou ouvrez une issue !

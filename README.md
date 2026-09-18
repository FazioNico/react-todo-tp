# 📝 React Todo App

Une application de gestion des tâches (Todo) construite avec React et Vite, intégrée avec Firebase pour l'authentification et le stockage des données. L'application offre des fonctionnalités de gestion des fichiers avec compression d'images et une authentification multi-méthode.

---

## 📋 Table des matières

- [Installation](#installation)
- [Stack technique](#stack-technique)
- [Usage](#usage)
- [Fonctionnalités](#fonctionnalités)
- [Structure du projet](#structure-du-projet)
- [Configuration](#configuration)
- [Scripts disponibles](#scripts-disponibles)
- [Documentation](#documentation)
- [Contribution](#contribution)
- [Licence](#licence)

---

## 🚀 Installation

### Prérequis

- Node.js (v18+)
- npm ou yarn

### Étapes d'installation

1. **Cloner le repository**
   ```bash
   git clone <repository-url>
   cd react-todo-tp
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Configurer Firebase** (voir [Configuration](#configuration))
   ```bash
   # Ajouter vos clés Firebase dans src/services/firebase/firebase.config.js
   ```

4. **Démarrer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera disponible à `http://localhost:5173`

---

## 🛠️ Stack technique

### Frontend
- **React** 19.2.8 - Bibliothèque UI
- **Vite** 8.3.0 - Build tool et dev server
- **CSS** - Stylisation native

### Backend & Services
- **Firebase** 12.19.0 - Authentication, Firestore & Storage
- **Compressor.js** 1.3.0 - Compression d'images côté client

### Outils de développement
- **Oxlint** 1.81.0 - Linter JavaScript performant
- **JSDoc** 4.0.5 - Documentation du code
- **TypeScript types** - Support des types React

---

## 💡 Usage

### Démarrage rapide

1. **Développement**
   ```bash
   npm run dev
   ```

2. **Authentification**
   - L'application supporte plusieurs méthodes d'authentification :
     - Google Sign-In
     - Email/Password
     - Authentification anonyme

3. **Gestion des Todos**
   - Créer une nouvelle tâche via le formulaire
   - Voir la liste de vos tâches
   - Les données sont synchronisées avec Firebase

4. **Upload de fichiers**
   - Utilisez le composant `UploadFile` pour charger des images
   - Les fichiers sont automatiquement compressés avant l'upload

---

## ✨ Fonctionnalités

- ✅ **Authentification flexible** - Google, Email/Password, Anonyme
- ✅ **Gestion des Todos** - Créer et visualiser des tâches
- ✅ **Stockage cloud** - Firebase Firestore pour la persistance
- ✅ **Upload de fichiers** - Avec compression automatique des images
- ✅ **Contextes React** - Gestion d'état centralisée (Todos, User)
- ✅ **Vérification d'admin** - Support des rôles administrateur
- ✅ **Synchronisation en temps réel** - via Firebase

---

## 📁 Structure du projet

```
react-todo-tp/
├── src/
│   ├── components/
│   │   ├── TodoForm.jsx        # Formulaire de création de todo
│   │   ├── TodosList.jsx       # Affichage de la liste des todos
│   │   └── UploadFile.jsx      # Composant d'upload de fichiers
│   ├── contextes/
│   │   ├── todos.context.jsx   # Contexte pour la gestion des todos
│   │   └── user.context.jsx    # Contexte pour l'authentification
│   ├── services/
│   │   └── firebase/
│   │       ├── firebase.config.js  # Configuration Firebase
│   │       └── firebase.js         # Fonctions Firebase
│   ├── assets/                 # Images et ressources statiques
│   ├── App.jsx                 # Composant principal
│   ├── App.css                 # Styles globaux
│   ├── index.css              # Styles de base
│   └── main.jsx               # Point d'entrée React
├── public/                     # Fichiers statiques
├── scripts/
│   └── docs.js                # Script de génération de documentation
├── vite.config.js             # Configuration Vite
├── .oxlintrc.json             # Configuration Oxlint
├── index.html                 # Template HTML
└── package.json               # Dépendances et scripts
```

---

## ⚙️ Configuration

### Firebase

1. **Créer un projet Firebase** sur [firebase.google.com](https://firebase.google.com)

2. **Ajouter vos clés** dans `src/services/firebase/firebase.config.js` :
   ```javascript
   export const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "your-project.firebaseapp.com",
     projectId: "your-project-id",
     storageBucket: "your-project.appspot.com",
     messagingSenderId: "your-messaging-sender-id",
     appId: "your-app-id"
   };
   ```

3. **Activer les services Firebase** :
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage

### Variables d'environnement

Créez un fichier `.env.local` à la racine du projet (non versionné) :
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# etc.
```

---

## 📦 Scripts disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarre le serveur de développement |
| `npm run build` | Construit l'application pour la production |
| `npm run preview` | Prévisualise la build production |
| `npm run lint` | Lance Oxlint pour vérifier le code |
| `npm run docs` | Génère la documentation JSDoc |

---

## 📚 Documentation

### Génération de la documentation

```bash
npm run docs
```

La documentation JSDoc est générée dans le répertoire `out/`.

### Principes de documentation

- **JSDoc comments** sur les fonctions et composants
- **Authentification** : voir [Marketing Docs](./marketing/docs/authentication.md)
- **Firebase** : voir [Marketing Docs](./marketing/docs/firebase.md)
- **Troubleshooting** : voir [Marketing Docs](./marketing/docs/troubleshooting.md)

---

## 🤝 Contribution

Les contributions sont bienvenues ! Pour contribuer :

1. Fork le repository
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commiter vos changements (`git commit -m 'feat: add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

### Standards de code

- Respecter les règles **Oxlint** : `npm run lint`
- Ajouter des commentaires JSDoc pour les nouvelles fonctions
- Suivre les conventions de nommage React

---

## 📄 Licence

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---

## 📞 Support

Pour des questions ou des problèmes :

- Consulter la [documentation Firebase](./marketing/docs/firebase.md)
- Voir le [guide de troubleshooting](./marketing/docs/troubleshooting.md)
- Ouvrir une issue sur le repository

---

**Créé avec ❤️ par FazioNico**

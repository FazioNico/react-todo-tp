# 📝 React Todo App - Documentation

Documentation complète style GitBook pour React Todo App, construite avec Astro et Tailwind CSS.

## 🌐 Structure de la documentation

La documentation est organisée en sections :

- **🏠 [Accueil](/)** - Page d'introduction
- **📖 [Guide](/docs/)** - Introduction, installation et configuration
- **🏗️ [Architecture](/docs/architecture/)** - Vue d'ensemble, structure, contextes
- **⚛️ [Composants](/docs/components/)** - App, TodoForm, TodosList, UploadFile
- **🔥 [Services](/docs/services/)** - Firebase et authentification
- **✅ [Contextes](/docs/contexts/)** - UserContext et TodosContext
- **❓ [Ressources](/docs/resources/)** - FAQ, Troubleshooting, API Reference

## 🚀 Démarrer rapidement

### Installation

```bash
cd marketing
npm install --legacy-peer-deps
npm run dev
```

La documentation s'ouvrira à `http://localhost:3000`

### Build pour production

```bash
npm run build
npm run preview
```

## 📂 Structure du projet

```
marketing/
├── src/
│   ├── pages/              # Pages Astro & Markdown
│   │   ├── index.astro     # Page d'accueil
│   │   └── docs/           # Pages de documentation
│   ├── layouts/            # Layouts réutilisables
│   │   ├── BaseLayout.astro
│   │   └── DocsLayout.astro
│   └── components/         # Composants Astro
│       ├── Sidebar.astro
│       └── TableOfContents.astro
├── astro.config.mjs        # Configuration Astro
├── tailwind.config.mjs     # Configuration Tailwind
└── package.json
```

## 🎨 Design système

La documentation utilise :

- **Layout 2-colonnes** : Sidebar navigation + contenu
- **Table des matières** : Navigation dans la page
- **Thème clair** : Design épuré style GitBook
- **Responsive** : Fonctionne sur mobile et desktop
- **Tailwind CSS** : Styling moderne et rapide

## 📄 Pages disponibles

### 1. Accueil
- Hero section avec CTA
- Fonctionnalités principales
- Stack technologique
- Démarrage rapide

### 2. Guide
- **Introduction** : Qu'est-ce que React Todo App
- **Installation** : Setup local et Firebase
- **Configuration** : Variables d'environnement, services

### 3. Architecture
- **Vue d'ensemble** : Diagrammes et flux
- **Structure** : Organisation des fichiers
- **Contextes** : Context API et gestion d'état

### 4. Composants
- **App** : Composant racine
- **TodoForm** : Formulaire d'ajout
- **TodosList** : Affichage de la liste
- **UploadFile** : Upload avec compression

### 5. Services
- **Firebase** : Intégration et API
- **Authentification** : Google, Email, Anonyme

### 6. Contextes
- **UserContext** : Gestion utilisateur
- **TodosContext** : Gestion des tâches

### 7. Ressources
- **FAQ** : Questions fréquentes
- **Troubleshooting** : Résolution de problèmes
- **API Reference** : Référence complète

## 🛠️ Personnalisation

### Modifier le design

Éditez `tailwind.config.mjs` :
```javascript
theme: {
  extend: {
    colors: {
      'primary': '#0070f3',  // Couleur principale
      'sidebar': '#f5f5f5'   // Couleur sidebar
    }
  }
}
```

### Ajouter une page

1. Créez un fichier `.md` dans `src/pages/docs/`
2. Ajoutez le frontmatter :
```yaml
---
layout: ../../layouts/DocsLayout.astro
title: Titre de la page
description: Description courte
---
```
3. Écrivez votre contenu en Markdown
4. Mettez à jour la navigation dans `Sidebar.astro`

### Modifier la navigation

Éditez `src/components/Sidebar.astro` :
```javascript
const docs = [
  { title: 'Accueil', href: '/', icon: '🏠' },
  {
    title: 'Nouvelle section',
    items: [
      { title: 'Page 1', href: '/docs/page1', icon: '📄' },
      { title: 'Page 2', href: '/docs/page2', icon: '📄' }
    ]
  }
];
```

## 📝 Guidelines de contenu

### Structure des pages

```markdown
---
layout: ../../layouts/DocsLayout.astro
title: Titre court
description: Une phrase descriptive
---

## Titre principal

Contenu introductif...

### Sous-titre

Contenu détaillé avec exemples de code.

### Bonnes pratiques

- ✅ À faire
- ❌ À éviter

---

**Suivant ?** [→ Lien vers la page suivante](/docs/...)
```

### Exemples de code

Utilisez les blocs code avec langage :

````markdown
```javascript
// Code d'exemple
const message = "Hello";
```

```json
{
  "key": "value"
}
```
````

## 🚀 Déploiement

### Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Vercel

```bash
npm run build
vercel deploy
```

### Netlify

1. Connectez votre repository GitHub
2. Configurez :
   - Build command: `npm run build`
   - Publish directory: `dist`

## 📊 Performance

La documentation est :
- **Ultra-rapide** : Build statique avec Astro
- **Optimisée** : Images optimisées automatiquement
- **Accessible** : Respecte les normes WCAG
- **SEO-friendly** : Meta tags optimisés

## 🔧 Maintenance

### Mise à jour du projet React

Mettez à jour la documentation quand :
- Nouvelles fonctionnalités ajoutées
- Architecture modifiée
- Dépendances mises à jour
- Bugs corrigés

### Versioning

Les versions de la documentation suivent le projet React :
- v1.0 → Documentation initiale
- v1.1 → Nouvelles fonctionnalités documentées
- v1.1.1 → Corrections et améliorations

## 🤝 Contribution

Pour améliorer la documentation :

1. Fork le repository
2. Créez une branche (`git checkout -b docs/improvement`)
3. Modifiez les fichiers `.md`
4. Commitez vos changements
5. Ouvrez une Pull Request

## 📚 Ressources

- [Documentation Astro](https://docs.astro.build)
- [Tailwind CSS](https://tailwindcss.com)
- [Markdown Guide](https://www.markdownguide.org)

## 📄 Licence

MIT - Utilisez librement

---

**Questions ?** Consultez la [FAQ](docs/resources/faq) ou le [Troubleshooting](docs/resources/troubleshooting)

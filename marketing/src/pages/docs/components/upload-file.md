---
layout: ../../../layouts/DocsLayout.astro
title: Composant UploadFile
description: Téléchargement et compression de fichiers
---

## Vue d'ensemble

Le composant `UploadFile` permet aux utilisateurs de télécharger des fichiers. Il utilise **Compressor.js** pour compresser les images avant de les envoyer à Firebase Storage.

## Code source

```javascript
// Import du composant (à implémenter selon vos besoins)
// Le composant doit gérer :
// 1. La sélection de fichier
// 2. La compression (Compressor.js)
// 3. L'upload vers Firebase Storage
// 4. L'affichage du statut
```

## Fonctionnement

### 1. Sélection du fichier

L'utilisateur clique sur un bouton pour sélectionner un fichier :

```javascript
<input type="file" onChange={handleFileSelect} accept="image/*" />
```

### 2. Compression avec Compressor.js

Quand un fichier est sélectionné, il est compressé :

```javascript
import Compressor from 'compressorjs';

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  
  new Compressor(file, {
    quality: 0.6,              // Qualité 60%
    maxWidth: 1920,            // Largeur max
    maxHeight: 1080,           // Hauteur max
    success(result) {
      uploadToFirebase(result);  // Fichier compressé
    },
    error(err) {
      console.error(err.message);
    }
  });
}
```

### 3. Upload vers Firebase Storage

```javascript
const uploadToFirebase = async (compressedFile) => {
  const fileRef = ref(storage, `files/${currentUser.uid}/${file.name}`);
  await uploadBytes(fileRef, compressedFile);
}
```

### 4. Affichage du statut

```javascript
const [uploading, setUploading] = useState(false);
const [progress, setProgress] = useState(0);

{uploading && <p>Upload {progress}%</p>}
```

## Implémentation complète

```javascript
import { useContext, useState } from 'react';
import { UserCtx } from '../contextes/user.context';
import { storage } from '../services/firebase/firebase';
import { ref, uploadBytes } from 'firebase/storage';
import Compressor from 'compressorjs';

export function UploadFile() {
  const { currentUser } = useContext(UserCtx);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    
    if (!file) return;
    if (!currentUser?.uid) {
      setError('Vous devez être connecté');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    new Compressor(file, {
      quality: 0.6,
      maxWidth: 1920,
      maxHeight: 1080,
      success: (compressedFile) => {
        uploadToFirebase(compressedFile, file.name);
      },
      error: (err) => {
        setError(err.message);
        setUploading(false);
      }
    });
  };

  const uploadToFirebase = async (compressedFile, fileName) => {
    try {
      const fileRef = ref(storage, `files/${currentUser.uid}/${fileName}`);
      await uploadBytes(fileRef, compressedFile);
      
      setSuccess(`${fileName} téléchargé avec succès`);
      setUploading(false);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <div className="upload-file">
      <h3>Télécharger un fichier</h3>
      
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        disabled={uploading}
      />
      
      {uploading && <p>Upload en cours...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
    </div>
  );
}
```

## Configuration Compressor.js

### Options disponibles

```javascript
{
  quality: 0.6,                    // Qualité JPEG (0-1)
  maxWidth: 1920,                  // Largeur maximale en pixels
  maxHeight: 1080,                 // Hauteur maximale en pixels
  minWidth: 0,                     // Largeur minimale
  minHeight: 0,                    // Hauteur minimale
  resize: 'cover',                 // 'cover', 'contain', 'none'
  convertSize: Infinity,           // Taille min avant conversion
  strict: true,                    // Strict mode
  checkOrientation: true,          // Tenir compte de l'orientation EXIF
  retainExif: false,               // Conserver les données EXIF
  success: (result) => {},         // Callback succès
  error: (error) => {}             // Callback erreur
}
```

### Présets de qualité

```javascript
// Haute qualité (documents)
{ quality: 0.8 }

// Qualité moyenne (photos)
{ quality: 0.6 }

// Basse qualité (thumbnails)
{ quality: 0.4 }

// Très basse qualité (aperçus)
{ quality: 0.2 }
```

## Gestion des erreurs

### ✅ Validations recommandées

```javascript
// Vérifier le type de fichier
if (!file.type.startsWith('image/')) {
  setError('Veuillez sélectionner une image');
  return;
}

// Vérifier la taille
if (file.size > 10 * 1024 * 1024) { // 10MB
  setError('Le fichier est trop volumineux');
  return;
}

// Vérifier que l'utilisateur est connecté
if (!currentUser?.uid) {
  setError('Vous devez être connecté');
  return;
}
```

## Firebase Storage Structure

Les fichiers sont organisés par utilisateur :

```
storage/
├── files/
│   ├── user123/
│   │   ├── photo1.jpg
│   │   ├── photo2.jpg
│   │   └── document.pdf
│   ├── user456/
│   │   └── ...
```

## Règles de sécurité Firebase Storage

```json
{
  "rules": {
    "files": {
      "{userId}": {
        ".read": "request.auth.uid == userId",
        ".write": "request.auth.uid == userId",
        ".indexOn": ["name"]
      }
    }
  }
}
```

## Amélioration avec drag & drop

```javascript
const [dragActive, setDragActive] = useState(false);

const handleDrag = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(e.type.includes('enter'));
};

const handleDrop = (e) => {
  e.preventDefault();
  e.stopPropagation();
  setDragActive(false);
  
  const file = e.dataTransfer.files?.[0];
  handleFileUpload(file);
};

return (
  <div
    onDragEnter={handleDrag}
    onDragLeave={handleDrag}
    onDragOver={handleDrag}
    onDrop={handleDrop}
    className={dragActive ? 'drag-active' : ''}
  >
    <p>Glissez-déposez une image ici</p>
    <input type="file" onChange={handleFileSelect} />
  </div>
);
```

## Affichage de l'aperçu

```javascript
const [preview, setPreview] = useState(null);

const handleFileSelect = (event) => {
  const file = event.target.files?.[0];
  
  // Créer un aperçu
  const reader = new FileReader();
  reader.onload = (e) => setPreview(e.target.result);
  reader.readAsDataURL(file);
  
  // Compresser et uploader
  new Compressor(file, { ... });
};

return (
  <>
    {preview && <img src={preview} alt="Aperçu" />}
    <input type="file" onChange={handleFileSelect} />
  </>
);
```

## Points clés

- ✅ Valide la présence de l'utilisateur
- ✅ Compresse les images avant upload
- ✅ Affiche le statut de l'upload
- ✅ Gère les erreurs
- ❌ Pas de drag & drop
- ❌ Pas d'aperçu avant upload

---

**Passons à** → [Services Firebase](/docs/services/firebase)

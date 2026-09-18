# 📝 React Todo App

A task management application (Todo) built with React and Vite, integrated with Firebase for authentication and data storage. The application offers file management features with image compression and multi-method authentication.

---

## 📋 Table of Contents

- [Installation](#installation)
- [Tech Stack](#tech-stack)
- [Usage](#usage)
- [Features](#features)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

---

## 🚀 Installation

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd react-todo-tp
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Firebase** (see [Configuration](#configuration))

   ```bash
   # Add your Firebase keys in src/services/firebase/firebase.config.js
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`

---

## 🛠️ Tech Stack

### Frontend

- **React** 19.2.8 - UI library
- **Vite** 8.3.0 - Build tool and dev server
- **CSS** - Native styling

### Backend & Services

- **Firebase** 12.19.0 - Authentication, Firestore & Storage
- **Compressor.js** 1.3.0 - Client-side image compression

### Development Tools

- **Oxlint** 1.81.0 - Fast JavaScript linter
- **JSDoc** 4.0.5 - Code documentation
- **TypeScript types** - React type support

---

## 💡 Usage

### Quick Start

1. **Development**

   ```bash
   npm run dev
   ```

2. **Authentication**
   - The application supports multiple authentication methods:
     - Google Sign-In
     - Email/Password
     - Anonymous authentication

3. **Todo Management**
   - Create a new task via the form
   - View your list of tasks
   - Data is synchronized with Firebase

4. **File Upload**
   - Use the `UploadFile` component to upload images
   - Files are automatically compressed before upload

---

## ✨ Features

- ✅ **Flexible Authentication** - Google, Email/Password, Anonymous
- ✅ **Todo Management** - Create and view tasks
- ✅ **Cloud Storage** - Firebase Firestore for data persistence
- ✅ **File Upload** - With automatic image compression
- ✅ **React Contexts** - Centralized state management (Todos, User)
- ✅ **Admin Verification** - Admin role support
- ✅ **Real-time Synchronization** - via Firebase

---

## 📁 Project Structure

```
react-todo-tp/
├── src/
│   ├── components/
│   │   ├── TodoForm.jsx        # Todo creation form
│   │   ├── TodosList.jsx       # Todo list display
│   │   └── UploadFile.jsx      # File upload component
│   ├── contextes/
│   │   ├── todos.context.jsx   # Context for todo management
│   │   └── user.context.jsx    # Context for authentication
│   ├── services/
│   │   └── firebase/
│   │       ├── firebase.config.js  # Firebase configuration
│   │       └── firebase.js         # Firebase functions
│   ├── assets/                 # Images and static resources
│   ├── App.jsx                 # Main component
│   ├── App.css                 # Global styles
│   ├── index.css               # Base styles
│   └── main.jsx                # React entry point
├── public/                     # Static files
├── scripts/
│   └── docs.js                 # Documentation generation script
├── vite.config.js              # Vite configuration
├── .oxlintrc.json              # Oxlint configuration
├── index.html                  # HTML template
└── package.json                # Dependencies and scripts
```

---

## ⚙️ Configuration

### Firebase

1. **Create a Firebase project** on [firebase.google.com](https://firebase.google.com)

2. **Add your keys** in `src/services/firebase/firebase.config.js`:

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

3. **Enable Firebase services**:
   - Authentication (Email/Password, Google)
   - Firestore Database
   - Storage

### Environment Variables

Create a `.env.local` file at the project root (not versioned):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
# etc.
```

---

## 📦 Available Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the application for production |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run Oxlint to check code |
| `npm run docs` | Generate JSDoc documentation |

---

## 📚 Documentation

### Generate Documentation

```bash
npm run docs
```

JSDoc documentation is generated in the `out/` directory.

### Documentation Principles

- **JSDoc comments** on functions and components
- **Authentication**: see [Marketing Docs](./marketing/docs/authentication.md)
- **Firebase**: see [Marketing Docs](./marketing/docs/firebase.md)
- **Troubleshooting**: see [Marketing Docs](./marketing/docs/troubleshooting.md)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- Follow **Oxlint** rules: `npm run lint`
- Add JSDoc comments for new functions
- Follow React naming conventions

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](./LICENSE) file for more details.

---

## 📞 Support

For questions or issues:

- Check the [Firebase documentation](./marketing/docs/firebase.md)
- See the [troubleshooting guide](./marketing/docs/troubleshooting.md)
- Open an issue on the repository

---

**Created with ❤️ by FazioNico**

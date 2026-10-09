# SecureXmotive Admin Portal — Authentication & Credentials Guide

## 🔐 Phase 5: Firebase Authentication

The Admin Portal authentication is integrated directly with **Firebase Authentication** (`securexmotivebase`).

- Authentication mechanism: Firebase Email/Password (`signInWithEmailAndPassword` / `signOut`)
- Real-time session state: Managed via Firebase `onAuthStateChanged`
- Storage: Firebase client SDK securely manages session tokens in IndexedDB; no passwords or secrets are stored in `localStorage` or `sessionStorage`.
- Route protection: Enforced by `AdminProtectedRoute` guarding `/admin/*`.
- Access control: Enforced by checking the authenticated user's UID against `VITE_FIREBASE_ADMIN_UID`. If an account without the authorized Admin UID logs in, it is immediately denied access and signed out.
- Authoritative security: Firestore security rules validate that all database writes/reads are restricted to the authorized admin UID.

---

## 🔑 Admin Credentials

Admin credentials are created and managed directly in the **Firebase Console**:
- **Console**: [Firebase Console > Authentication > Users](https://console.firebase.google.com/)
- Sign in with the registered administrator email & password.

---

## ⚙️ Environment Variables

Add or verify the following in your `.env` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyC1TyVkbXbQVjBS8EN5koK8BekPzuZ0PlM
VITE_FIREBASE_AUTH_DOMAIN=xmotivebase.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=securexmotivebase
VITE_FIREBASE_STORAGE_BUCKET=xmotivebase.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=663045401238
VITE_FIREBASE_APP_ID=1:663045401238:web:cb875176fef173aee2f0b7
VITE_FIREBASE_MEASUREMENT_ID=G-WVS8PT1687

# Designated Firebase Admin UID authorized to access Admin Portal
# Copy this from Firebase Console > Authentication > Users (User UID column)
VITE_FIREBASE_ADMIN_UID=
```

---

## 📁 Key Routes

- `/admin/login` — Firebase Admin Login
- `/admin` — Admin Dashboard with live stats & recent items
- `/admin/applications` — Career Applications List & Search
- `/admin/applications/:id` — Career Application Details
- `/admin/messages` — Contact Us Submissions List & Search
- `/admin/messages/:id` — Contact Us Submission Detail
- `/admin/videos` — Video Management (List, Status Toggle, Delete)
- `/admin/videos/new` — Create New Video
- `/admin/videos/:id/edit` — Edit Existing Video

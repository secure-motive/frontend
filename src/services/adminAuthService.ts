import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import type { AdminUser } from '@/admin/types/admin'

/**
 * Designated Firebase Admin UID authorized to access Admin Portal.
 * Sourced from Vite environment variable VITE_FIREBASE_ADMIN_UID.
 */
export const ADMIN_UID = import.meta.env.VITE_FIREBASE_ADMIN_UID?.trim()

/**
 * Format Firebase Auth errors into clear, actionable messages.
 */
export function getFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = String((error as { code: string }).code)
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please verify your credentials.'
      case 'auth/invalid-email':
        return 'The email address format is invalid.'
      case 'auth/user-disabled':
        return 'This administrator account has been disabled. Please contact support.'
      case 'auth/too-many-requests':
        return 'Access to this account has been temporarily disabled due to many failed login attempts. Please try again later.'
      case 'auth/network-request-failed':
        return 'Network connection error. Please verify your internet connection and try again.'
      case 'auth/operation-not-allowed':
        return 'Email/password sign-in is not enabled in Firebase Console. Please enable Email/Password provider under Authentication > Sign-in method.'
      case 'auth/internal-error':
        return 'An internal authentication error occurred. Please try again.'
      default:
        if ('message' in error && typeof error.message === 'string' && error.message) {
          return error.message
        }
        break
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Authentication failed. Please verify your credentials.'
}

/**
 * Maps a Firebase User instance to the SecureXmotive AdminUser interface.
 */
export function mapFirebaseUserToAdmin(user: User): AdminUser {
  const username = user.displayName || user.email?.split('@')[0] || 'Admin'
  const displayName = username.charAt(0).toUpperCase() + username.slice(1)

  return {
    id: user.uid,
    email: user.email || '',
    name: displayName === 'Admin' ? 'Security Admin' : `${displayName} (Admin)`,
    role: 'SUPER_ADMIN',
    avatarUrl: user.photoURL || undefined,
    lastLoginAt: user.metadata.lastSignInTime || new Date().toISOString(),
  }
}

export const adminAuthService = {
  /**
   * Authenticate administrator via Firebase Email/Password Authentication.
   * Verifies against designated ADMIN_UID if configured.
   */
  async login(email: string, password: string): Promise<AdminUser> {
    const credential = await signInWithEmailAndPassword(auth, email.trim(), password)
    const firebaseUser = credential.user

    // If a designated Admin UID is configured, verify the authenticated user matches
    if (ADMIN_UID && firebaseUser.uid !== ADMIN_UID) {
      console.warn(
        `[Firebase Auth] Access denied: Authenticated UID "${firebaseUser.uid}" does not match designated Admin UID "${ADMIN_UID}".`,
      )
      await firebaseSignOut(auth)
      throw new Error('Access denied: This Firebase account is not authorized to access the admin portal.')
    }

    return mapFirebaseUserToAdmin(firebaseUser)
  },

  /**
   * Logout administrator from Firebase Authentication.
   */
  async logout(): Promise<void> {
    await firebaseSignOut(auth)
  },

  /**
   * Returns current Firebase User if one is currently signed in.
   */
  getCurrentUser(): User | null {
    return auth.currentUser
  },

  /**
   * Subscribe to Firebase Authentication state changes.
   * Automatically enforces Admin UID check and resolves session state.
   */
  onAuthStateChanged(
    callback: (user: AdminUser | null, firebaseUser: User | null) => void,
  ): Unsubscribe {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        callback(null, null)
        return
      }

      // Enforce designated Admin UID restriction
      if (ADMIN_UID && firebaseUser.uid !== ADMIN_UID) {
        console.warn(
          `[Firebase Auth] Active session UID "${firebaseUser.uid}" does not match designated Admin UID "${ADMIN_UID}". Signing out.`,
        )
        await firebaseSignOut(auth)
        callback(null, null)
        return
      }

      callback(mapFirebaseUserToAdmin(firebaseUser), firebaseUser)
    })
  },
}

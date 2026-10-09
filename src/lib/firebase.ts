import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app'
import { getAnalytics, isSupported, type Analytics, logEvent } from 'firebase/analytics'
import { getAuth, type Auth } from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'

/**
 * Firebase configuration for the web application.
 * Values are retrieved from Vite environment variables (VITE_FIREBASE_*)
 * with fallbacks to the project defaults.
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC1TyVkbXbQVjBS8EN5koK8BekPzuZ0PlM',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'xmotivebase.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'xmotivebase',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'xmotivebase.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '663045401238',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:663045401238:web:cb875176fef173aee2f0b7',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-WVS8PT1687',
}

/**
 * Initialize or retrieve the active Firebase App instance.
 * Ensures a singleton instance across HMR (Hot Module Replacement) cycles.
 */
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

/**
 * Cached Analytics instance.
 */
let analyticsInstance: Analytics | null = null;

/**
 * Initialize Analytics safely checking for browser environment and IndexedDB support.
 */
export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null
  if (analyticsInstance) return analyticsInstance

  try {
    const supported = await isSupported()
    if (supported) {
      analyticsInstance = getAnalytics(app)
      return analyticsInstance
    }
  } catch (error) {
    console.warn('[Firebase] Analytics not supported in this environment:', error)
  }
  return null
}

/**
 * Promise resolving to the Analytics instance if supported.
 */
export const analyticsPromise: Promise<Analytics | null> = getFirebaseAnalytics()

/**
 * Helper to safely log Firebase analytics events.
 */
export async function trackEvent(eventName: string, eventParams?: Record<string, unknown>): Promise<void> {
  try {
    const analytics = await getFirebaseAnalytics()
    if (analytics) {
      logEvent(analytics, eventName, eventParams)
    }
  } catch (err) {
    console.warn(`[Firebase] Failed to log event "${eventName}":`, err)
  }
}

/**
 * Firebase Authentication instance.
 */
export const auth: Auth = getAuth(app)

/**
 * Cloud Firestore instance.
 */
export const db: Firestore = getFirestore(app)

/**
 * Firebase Storage instance.
 */
export const storage: FirebaseStorage = getStorage(app)

export default app

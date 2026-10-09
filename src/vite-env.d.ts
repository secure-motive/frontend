/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of the SecureXmotive backend, without a trailing slash. */
  readonly VITE_API_BASE_URL?: string
  /** "true" lets forms call the backend; anything else keeps them in preview mode. */
  readonly VITE_ENABLE_API?: string

  /** Firebase Configuration */
  readonly VITE_FIREBASE_API_KEY?: string
  readonly VITE_FIREBASE_AUTH_DOMAIN?: string
  readonly VITE_FIREBASE_PROJECT_ID?: string
  readonly VITE_FIREBASE_STORAGE_BUCKET?: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  readonly VITE_FIREBASE_APP_ID?: string
  readonly VITE_FIREBASE_MEASUREMENT_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}


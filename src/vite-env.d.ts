/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_FIREBASE_API_KEY,
  readonly VITE_FIREBASE_AUTH_DOMAIN,
  readonly VITE_FIREBASE_DATABASE_URL
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string
  readonly VITE_UNSPLASH_ACCESS_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Google API 타입 정의
declare const gapi: typeof import('gapi');

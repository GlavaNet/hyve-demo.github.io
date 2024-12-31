/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_INSTAGRAM_TOKEN: string
    readonly VITE_INSTAGRAM_USER_ID: string
    readonly VITE_BUSINESS_NAME: string
    readonly VITE_CONTACT_EMAIL: string
    readonly VITE_CONTACT_PHONE: string
    readonly VITE_BIO: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
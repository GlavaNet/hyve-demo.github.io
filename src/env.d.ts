/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_INSTAGRAM_TOKEN: string
    readonly VITE_INSTAGRAM_USER_ID: string
    readonly VITE_BUSINESS_NAME: string
    readonly VITE_INSTAGRAM_HANDLE: string
    readonly VITE_PORTFOLIO_URL: string
    readonly VITE_DESIGNER_NAME: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
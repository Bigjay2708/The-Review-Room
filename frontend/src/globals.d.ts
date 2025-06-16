/// <reference types="react-scripts" />

// Add custom environment variable typings for React
interface ProcessEnv {
  readonly REACT_APP_TMDB_API_KEY: string;
  readonly REACT_APP_API_BASE_URL?: string;
}

interface ImportMetaEnv extends ProcessEnv {}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_APP_TMDB_API_KEY: string;
    readonly REACT_APP_API_BASE_URL?: string;
  }
}

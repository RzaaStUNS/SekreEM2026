/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // tambahin variable lain di sini kalau nanti ada
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
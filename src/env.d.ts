/// <reference types="vite/client" />

const chrome = window.chrome

interface ImportMetaEnv {
   readonly VITE_DISPATCHERS: string
}

interface ImportMeta {
   readonly env: ImportMetaEnv
}

declare module '*.vue' {
   import type { DefineComponent } from 'vue'
   // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
   const component: DefineComponent<{}, {}, any>
   export default component
}

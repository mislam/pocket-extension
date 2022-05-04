import { resolve } from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { obfuscator } from 'rollup-obfuscator'
import obfuscatorOptions from './obfuscator.config'

// Read the extension manifest
const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'))

export default defineConfig(({ command, mode }) => {
   return {
      plugins: [vue()],
      root: 'src',
      publicDir: resolve(__dirname, 'public'),
      build: {
         outDir: resolve(__dirname, `build/${mode}/v${manifest.version}`),
         assetsDir: '.',
         emptyOutDir: true,
         rollupOptions: {
            input: 'src/popup.html',
            plugins: command === 'build' ? [obfuscator(obfuscatorOptions)] : [],
         },
      },
      resolve: {
         alias: {
            '@': resolve(__dirname, 'src'),
            '@packages': resolve(__dirname, 'packages'),
         },
      },
   }
})

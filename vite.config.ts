import { resolve } from 'path'
import { readFileSync } from 'fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { rollupPlugins } from './vite.rollup.config'

// Read the extension manifest
const manifest = JSON.parse(readFileSync('public/manifest.json', 'utf8'))

export default defineConfig(({ command, mode }) => {
   return {
      plugins: [vue()],
      root: 'src',
      publicDir: resolve(__dirname, 'public'),
      envPrefix: '_',
      build: {
         outDir: resolve(__dirname, `build/${mode}/v${manifest.version}`),
         assetsDir: '.',
         emptyOutDir: true,
         rollupOptions: {
            input: resolve(__dirname, 'src/popup.html'),
            plugins: command === 'build' ? rollupPlugins : [],
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

import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { obfuscator } from 'rollup-obfuscator'
import obfuscatorOptions from './obfuscator.config'

export default defineConfig(({ command }) => {
   console.log(command)
   return {
      plugins: [vue()],
      root: 'src',
      publicDir: resolve(__dirname, 'public'),
      build: {
         outDir: resolve(__dirname, 'dist'),
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

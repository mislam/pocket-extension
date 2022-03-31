import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
   plugins: [vue()],
   root: 'src',
   publicDir: resolve(__dirname, 'public'),
   build: {
      outDir: resolve(__dirname, 'dist'),
      emptyOutDir: true,
      rollupOptions: {
         input: {
            popup: resolve(__dirname, 'src/popup.html'),
         },
      },
   },
   resolve: {
      alias: {
         '@': resolve(__dirname, 'src'),
      },
   },
})

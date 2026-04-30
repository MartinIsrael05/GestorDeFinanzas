import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    open: true, // 👈 Esto hace que se abra el navegador automáticamente
    // si querés abrir una URL específica o un puerto fijo:
    // port: 5173,
    // open: '/ruta/siqueres.html'
  }
})

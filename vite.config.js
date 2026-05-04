import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  server: {
    proxy: {
      '/api': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
      '/admin': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
      '/login': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
      '/logout': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
      '/register': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
      '/me': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
      '/health': { target: 'https://sakura-b.onrender.com', changeOrigin: true },
    }
  }
})

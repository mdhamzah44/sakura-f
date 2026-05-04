import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'dist' },
  server: {
    proxy: {
      '/api': { target: 'http://localhost:3001', changeOrigin: true },
      '/admin': { target: 'http://localhost:3001', changeOrigin: true },
      '/login': { target: 'http://localhost:3001', changeOrigin: true },
      '/logout': { target: 'http://localhost:3001', changeOrigin: true },
      '/register': { target: 'http://localhost:3001', changeOrigin: true },
      '/me': { target: 'http://localhost:3001', changeOrigin: true },
      '/health': { target: 'http://localhost:3001', changeOrigin: true },
    }
  }
})
